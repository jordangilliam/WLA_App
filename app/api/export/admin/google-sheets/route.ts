import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  const accessToken = (session as any).access_token as string;
  if (!accessToken) return NextResponse.json({ ok: false, error: "Missing Google token" }, { status: 400 });

  const { rows } = await req.json();
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ ok: false, error: "No rows" }, { status: 400 });

  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A1";
  if (!sheetId) return NextResponse.json({ ok: false, error: "Missing GOOGLE_SHEETS_ID" }, { status: 400 });

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows })
  });
  const out = await res.json();
  if (!res.ok) return NextResponse.json({ ok: false, error: out }, { status: 500 });
  return NextResponse.json({ ok: true, updates: out.updates });
}
