export async function gdEnsureFolder(name: string, parentId: string | null, accessToken: string) {
  const q = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false` + (parentId ? ` and '${parentId}' in parents` : ""));
  const listRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const listJson = await listRes.json();
  if (listJson.files && listJson.files.length > 0) return listJson.files[0].id as string;
  const body = { name, mimeType: "application/vnd.google-apps.folder", ...(parentId ? { parents: [parentId] } : {}) };
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const createJson = await createRes.json();
  return createJson.id as string;
}

export async function gdUploadString(name: string, mime: string, content: string, parentId: string, accessToken: string) {
  const boundary = "wlaboundary" + Date.now();
  const metadata = { name, parents: [parentId], mimeType: mime };
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${mime}\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body
  });
  const out = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(JSON.stringify(out));
  return out;
}

export async function msGraph(path: string, init: RequestInit, token: string) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...init,
    headers: { ...(init.headers||{}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Graph error ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function odEnsureChildFolder(parentId: string, name: string, token: string): Promise<string> {
  const list = await msGraph(`/me/drive/items/${parentId}/children?$select=id,name,folder`, { method: "GET" }, token);
  const hit = (list.value || []).find((x: any) => x.folder && x.name === name);
  if (hit) return hit.id as string;
  const created = await msGraph(`/me/drive/items/${parentId}/children`, { method: "POST", body: JSON.stringify({ name, folder: {}, "@microsoft.graph.conflictBehavior": "rename" }) }, token);
  return created.id as string;
}

export async function odUploadString(parentId: string, name: string, mime: string, content: string, token: string) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${parentId}:/${name}:/content`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": mime },
    body: content
  });
  const out = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(out));
  return out;
}
