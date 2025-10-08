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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  const token = (session as any).ms_access_token as string;
  if (!token) return NextResponse.json({ ok: false, error: "Missing Microsoft token" }, { status: 400 });

  const { rows } = await req.json();
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ ok: false, error: "No rows" }, { status: 400 });

  const path = process.env.ONEDRIVE_WORKBOOK_PATH || "WLA/Admin/Reports/admin.xlsx";
  const table = process.env.ONEDRIVE_TABLE_NAME || "Sessions";

  // Resolve workbook item
  const item = await graph(`/me/drive/root:/${encodeURIComponent(path)}?select=id,name`, { method: "GET" }, token);
  const itemId = item.id as string;

  // Add rows
  const added = await graph(`/me/drive/items/${itemId}/workbook/tables/${table}/rows/add`, {
    method: "POST",
    body: JSON.stringify({ values: rows })
  }, token);

  return NextResponse.json({ ok: true, result: added });
}
