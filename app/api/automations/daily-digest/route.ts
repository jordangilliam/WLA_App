import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { gdEnsureFolder, gdUploadString, msGraph, odEnsureChildFolder, odUploadString } from "@/app/api/_lib/storage";
import { } from "@/app/api/automations/_common";

export async function POST(req: NextRequest){
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok:false, error:'Not authenticated' }, { status: 401 });
  const gtok = (session as any).access_token as string | undefined;
  const mtok = (session as any).ms_access_token as string | undefined;

  const { track, sessions } = await req.json(); // sessions: array of student session JSONs
  const dateStr = new Date().toISOString().slice(0,10);

  const totalStudents = (sessions||[]).length;
  const totalPoints = (sessions||[]).reduce((sum:any,s:any)=> sum + ((s.points||[]).reduce((a:any,b:any)=>a+(b?.delta||0),0)), 0);
  const totalReadings = (sessions||[]).reduce((sum:any,s:any)=> sum + ((s.readings||[]).length||0), 0);
  const totalJournal = (sessions||[]).reduce((sum:any,s:any)=> sum + ((s.journal||[]).length||0), 0);

  const body = `<h1>Daily Digest — ${track || 'General'} — ${dateStr}</h1>
  <p class="muted">Auto-generated from admin console.</p>
  <ul>
    <li><strong>Students:</strong> ${totalStudents}</li>
    <li><strong>Total Points:</strong> ${totalPoints}</li>
    <li><strong>Water Readings:</strong> ${totalReadings}</li>
    <li><strong>Journal Entries:</strong> ${totalJournal}</li>
  </ul>`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Digest</title></head><body>${body}</body></html>`;
  const json = JSON.stringify({ track, date: dateStr, totalStudents, totalPoints, totalReadings, totalJournal }, null, 2);

  const out:any = { ok:true, google:null, onedrive:null };
  // Google upload
  if (gtok){
    const root = await gdEnsureFolder("WLA", null, gtok);
    const admin = await gdEnsureFolder("Admin", root, gtok);
    const dig = await gdEnsureFolder("Digests", admin, gtok);
    const t = await gdEnsureFolder(track || "General", dig, gtok);
    const day = await gdEnsureFolder(dateStr, t, gtok);
    const h = await gdUploadString(`digest-${dateStr}.html`, "text/html", html, day, gtok);
    const j = await gdUploadString(`digest-${dateStr}.json`, "application/json", json, day, gtok);
    out.google = { html:h, json:j };
  }
  // OneDrive upload
  if (mtok){
    const root = await msGraph(`/me/drive/root`, { method: "GET" }, mtok);
    const rootId = root.id as string;
    const wla = await odEnsureChildFolder(rootId, "WLA", mtok);
    const admin = await odEnsureChildFolder(wla, "Admin", mtok);
    const dig = await odEnsureChildFolder(admin, "Digests", mtok);
    const t = await odEnsureChildFolder(dig, track || "General", mtok);
    const day = await odEnsureChildFolder(t, dateStr, mtok);
    const h = await odUploadString(day, `digest-${dateStr}.html`, "text/html", html, mtok);
    const j = await odUploadString(day, `digest-${dateStr}.json`, "application/json", json, mtok);
    out.onedrive = { html:h, json:j };
  }

  return NextResponse.json(out);
}
