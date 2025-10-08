import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { gdEnsureFolder, gdUploadString, msGraph, odEnsureChildFolder, odUploadString } from "@/app/api/_lib/storage";

function zscores(values: number[]){
  const n = values.length || 1;
  const mean = values.reduce((a,b)=>a+b,0)/n;
  const sd = Math.sqrt(values.reduce((a,b)=> a + Math.pow(b-mean,2),0)/n) || 1;
  return values.map(v => (v-mean)/sd);
}

export async function POST(req: NextRequest){
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok:false, error:'Not authenticated' }, { status: 401 });
  const gtok = (session as any).access_token as string | undefined;
  const mtok = (session as any).ms_access_token as string | undefined;

  const { track, series } = await req.json(); // [{email, week, points}]
  const dateStr = new Date().toISOString().slice(0,10);

  const grouped: Record<string, {week:string,points:number}[]> = {};
  (series||[]).forEach((r:any)=>{
    grouped[r.email] = grouped[r.email] || [];
    grouped[r.email].push({ week: r.week, points: Number(r.points||0) });
  });

  const rows: any[] = [];
  Object.entries(grouped).forEach(([email, arr])=>{
    const vals = arr.map(x=>x.points);
    const zs = zscores(vals);
    const alerts = zs.map((z,i)=> ({ week: arr[i].week, points: arr[i].points, z }))
      .filter(x=> Math.abs(x.z) >= 2);
    alerts.forEach(a=> rows.push({ email, week: a.week, points: a.points, z: a.z.toFixed(2) }));
  });

  const csv = (rows.length ? (['email','week','points','z'].join(',') + '\n' + rows.map(r=> [r.email,r.week,r.points,r.z].join(',')).join('\n')) : 'email,week,points,z\n');
  const html = `<!doctype html><html><body><h1>Anomalies — ${track||'General'} — ${dateStr}</h1>
    <p>${rows.length} alerts (|z| ≥ 2)</p>
    <table><tr><th>Email</th><th>Week</th><th>Points</th><th>z</th></tr>${
      rows.map(r=>`<tr><td>${r.email}</td><td>${r.week}</td><td>${r.points}</td><td>${r.z}</td></tr>`).join('')
    }</table></body></html>`;

  const out:any = { ok:true, google:null, onedrive:null };
  if (gtok){
    const root = await gdEnsureFolder("WLA", null, gtok);
    const admin = await gdEnsureFolder("Admin", root, gtok);
    const alerts = await gdEnsureFolder("Alerts", admin, gtok);
    const t = await gdEnsureFolder(track || "General", alerts, gtok);
    const day = await gdEnsureFolder(dateStr, t, gtok);
    const h = await gdUploadString(`anomalies-${dateStr}.html`, "text/html", html, day, gtok);
    const c = await gdUploadString(`anomalies-${dateStr}.csv`, "text/csv", csv, day, gtok);
    out.google = { html:h, csv:c };
  }
  if (mtok){
    const root = await msGraph(`/me/drive/root`, { method: "GET" }, mtok);
    const rootId = root.id as string;
    const wla = await odEnsureChildFolder(rootId, "WLA", mtok);
    const admin = await odEnsureChildFolder(wla, "Admin", mtok);
    const alerts = await odEnsureChildFolder(admin, "Alerts", mtok);
    const t = await odEnsureChildFolder(alerts, track || "General", mtok);
    const day = await odEnsureChildFolder(t, dateStr, mtok);
    const h = await odUploadString(day, `anomalies-${dateStr}.html`, "text/html", html, mtok);
    const c = await odUploadString(day, `anomalies-${dateStr}.csv`, "text/csv", csv, mtok);
    out.onedrive = { html:h, csv:c };
  }
  return NextResponse.json(out);
}
