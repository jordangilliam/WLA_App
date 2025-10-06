import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function ensureFolder(name: string, parentId: string | null, accessToken: string) {
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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

  const { data, track, team } = await req.json();
  const accessToken = (session as any).access_token as string;
  if (!accessToken) return NextResponse.json({ ok: false, error: "Missing Google access token (check scopes)" }, { status: 400 });

  const userEmail = session.user?.email || "unknown@student";
  try {
    const root = await ensureFolder("WLA", null, accessToken);
    const exportsRoot = await ensureFolder("Exports", root, accessToken);
    const trackRoot = await ensureFolder(track || "General", exportsRoot, accessToken);
    const emailRoot = await ensureFolder(userEmail, trackRoot, accessToken);
    const teamRoot = await ensureFolder(team || "NoTeam", emailRoot, accessToken);

    const boundary = "wlaboundary" + Date.now();
    const filename = `wla-session-${Date.now()}.json`;
    const metadata = { name: filename, parents: [teamRoot], mimeType: "application/json" };
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      `${JSON.stringify(data)}\r\n` +
      `--${boundary}--`;

    const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    });
    const uploadJson = await uploadRes.json();
    if (uploadRes.ok) { return NextResponse.json({ ok: true, id: uploadJson.id, name: uploadJson.name, webViewLink: uploadJson.webViewLink }); }
    return NextResponse.json({ ok: false, error: uploadJson }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
