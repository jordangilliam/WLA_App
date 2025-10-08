import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { gdEnsureFolder, gdUploadString, msGraph, odEnsureChildFolder, odUploadString } from "@/app/api/_lib/storage";

export async function POST(req: NextRequest){
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok:false, error:'Not authenticated' }, { status: 401 });
  const gtok = (session as any).access_token as string | undefined;
  const mtok = (session as any).ms_access_token as string | undefined;

  const { grantName, track, timeframe, narrative, sessions } = await req.json();
  const dateStr = new Date().toISOString().slice(0,10);
  const md = `# Grant Pack — ${grantName || 'Untitled'}\n\n- Track: ${track || 'General'}\n- Timeframe: ${timeframe || dateStr}\n\n## Narrative\n${narrative || ''}\n\n## Metrics\n- Students: ${(sessions||[]).length}\n- Total Points: ${(sessions||[]).reduce((s:any,x:any)=> s + ((x.points||[]).reduce((a:any,b:any)=>a+(b?.delta||0),0)), 0)}\n- Water Readings: ${(sessions||[]).reduce((s:any,x:any)=> s + ((x.readings||[]).length||0), 0)}\n- Journal Entries: ${(sessions||[]).reduce((s:any,x:any)=> s + ((x.journal||[]).length||0), 0)}\n`;

  const rows = (sessions||[]).map((s:any,i:number)=>{
    const pts = (s.points||[]).reduce((a:any,b:any)=>a+(b?.delta||0),0);
    return { idx:i+1, email: s.email || s.userEmail || 'unknown', team: s.team || 'NoTeam', track: s.track || track || 'General', points: pts, readings: (s.readings||[]).length||0, journal: (s.journal||[]).length||0 };
  });
  const csv = (rows.length ? (Object.keys(rows[0]).join(',') + '\n' + rows.map((r: any)=> Object.values(r).join(',')).join('\n')) : 'idx,email,team,track,points,readings,journal\n');

  const out:any = { ok:true, google:null, onedrive:null };
  if (gtok){
    const root = await gdEnsureFolder("WLA", null, gtok);
    const admin = await gdEnsureFolder("Admin", root, gtok);
    const grants = await gdEnsureFolder("Grants", admin, gtok);
    const g = await gdEnsureFolder(grantName || "Untitled", grants, gtok);
    const day = await gdEnsureFolder(dateStr, g, gtok);
    const mdu = await gdUploadString(`pack-${dateStr}.md`, "text/markdown", md, day, gtok);
    const cs = await gdUploadString(`pack-${dateStr}.csv`, "text/csv", csv, day, gtok);
    out.google = { md:mdu, csv:cs };
  }
  if (mtok){
    const root = await msGraph(`/me/drive/root`, { method: "GET" }, mtok);
    const rootId = root.id as string;
    const wla = await odEnsureChildFolder(rootId, "WLA", mtok);
    const admin = await odEnsureChildFolder(wla, "Admin", mtok);
    const grants = await odEnsureChildFolder(admin, "Grants", mtok);
    const g = await odEnsureChildFolder(grants, grantName || "Untitled", mtok);
    const day = await odEnsureChildFolder(g, dateStr, mtok);
    const mdu = await odUploadString(day, `pack-${dateStr}.md`, "text/markdown", md, mtok);
    const cs = await odUploadString(day, `pack-${dateStr}.csv`, "text/csv", csv, mtok);
    out.onedrive = { md:mdu, csv:cs };
  }
  return NextResponse.json(out);
}
