import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";

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
  const accessToken = (session as any).access_token as string;
  if (!accessToken) return NextResponse.json({ ok: false, error: "Missing Google token" }, { status: 400 });

  const { csv, track } = await req.json();
  if (!csv) return NextResponse.json({ ok: false, error: "Missing CSV" }, { status: 400 });

  const dateStr = new Date().toISOString().slice(0,10);
  try {
    // WLA/Admin/Reports/{Track}/{YYYY-MM-DD}
    const root = await ensureFolder("WLA", null, accessToken);
    const admin = await ensureFolder("Admin", root, accessToken);
    const reports = await ensureFolder("Reports", admin, accessToken);
    const t = await ensureFolder(track || "General", reports, accessToken);
    const day = await ensureFolder(dateStr, t, accessToken);

    const boundary = "wlaboundary" + Date.now();
    const filename = `katie-export-${track}-${dateStr}.csv`;
    const metadata = { name: filename, parents: [day], mimeType: "text/csv" };
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: text/csv\r\n\r\n` +
      `${csv}\r\n` +
      `--${boundary}--`;

    const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    });
    const out = await uploadRes.json();
    if (!uploadRes.ok) return NextResponse.json({ ok: false, error: out }, { status: 500 });
    return NextResponse.json({ ok: true, id: out.id, name: out.name, webViewLink: out.webViewLink });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
