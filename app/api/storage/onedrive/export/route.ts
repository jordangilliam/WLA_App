import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";

async function graph(path: string, init: RequestInit, token: string) {
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

async function ensureChildFolder(parentId: string, name: string, token: string): Promise<string> {
  // List children and try to find
  const list = await graph(`/me/drive/items/${parentId}/children?$select=id,name,folder`, { method: "GET" }, token);
  const hit = (list.value || []).find((x: any) => x.folder && x.name === name);
  if (hit) return hit.id as string;
  // Create
  const created = await graph(`/me/drive/items/${parentId}/children`, { method: "POST", body: JSON.stringify({ name, folder: {}, "@microsoft.graph.conflictBehavior": "rename" }) }, token);
  return created.id as string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  const token = (session as any).ms_access_token as string;
  if (!token) return NextResponse.json({ ok: false, error: "No Microsoft token. Sign in with Microsoft." }, { status: 400 });

  const { data, track, team } = await req.json();
  const email = session.user?.email || "unknown@student";

  try {
    // Get root
    const root = await graph(`/me/drive/root`, { method: "GET" }, token);
    const rootId = root.id as string;
    // Create folders: /WLA/Exports/{Track}/{Email}/{Team}
    const wlaId = await ensureChildFolder(rootId, "WLA", token);
    const exportsId = await ensureChildFolder(wlaId, "Exports", token);
    const trackId = await ensureChildFolder(exportsId, track || "General", token);
    const emailId = await ensureChildFolder(trackId, email, token);
    const teamId = await ensureChildFolder(emailId, team || "NoTeam", token);

    const filename = `wla-session-${Date.now()}.json`;
    // Upload content via PUT to /items/{parentId}:/filename:/content
    const uploadRes = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${teamId}:/${filename}:/content`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const info = await uploadRes.json();
    if (!uploadRes.ok) {
      return NextResponse.json({ ok: false, error: info }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: info.id, name: info.name, webUrl: info.webUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
