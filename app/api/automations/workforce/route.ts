import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { gdEnsureFolder, gdUploadString, msGraph, odEnsureChildFolder, odUploadString } from "@/app/api/_lib/storage";

export async function POST(req: NextRequest){
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok:false, error:'Not authenticated' }, { status: 401 });
  const gtok = (session as any).access_token as string | undefined;
  const mtok = (session as any).ms_access_token as string | undefined;

  const { track, jobs } = await req.json(); // jobs: array of {title, org, location, url, skills[], certs[], deadline}
  const dateStr = new Date().toISOString().slice(0,10);

  const rows = (jobs||[]).map((j:any,i:number)=> ({
    idx: i+1,
    title: j.title || '',
    org: j.org || '',
    location: j.location || '',
    url: j.url || '',
    skills: Array.isArray(j.skills) ? j.skills.join('|') : '',
    certs: Array.isArray(j.certs) ? j.certs.join('|') : '',
    deadline: j.deadline || ''
  }));
  const csv = (rows.length ? (Object.keys(rows[0]).join(',') + '\n' + rows.map(r=> Object.values(r).join(',')).join('\n')) : 'idx,title,org,location,url,skills,certs,deadline\n');

  const out:any = { ok:true, google:null, onedrive:null };
  if (gtok){
    const root = await gdEnsureFolder("WLA", null, gtok);
    const admin = await gdEnsureFolder("Admin", root, gtok);
    const jobsF = await gdEnsureFolder("Jobs", admin, gtok);
    const t = await gdEnsureFolder(track || "General", jobsF, gtok);
    const day = await gdEnsureFolder(dateStr, t, gtok);
    const cs = await gdUploadString(`jobs-${dateStr}.csv`, "text/csv", csv, day, gtok);
    out.google = { csv: cs };
  }
  if (mtok){
    const root = await msGraph(`/me/drive/root`, { method: "GET" }, mtok);
    const rootId = root.id as string;
    const wla = await odEnsureChildFolder(rootId, "WLA", mtok);
    const admin = await odEnsureChildFolder(wla, "Admin", mtok);
    const jobsF = await odEnsureChildFolder(admin, "Jobs", mtok);
    const t = await odEnsureChildFolder(jobsF, track || "General", mtok);
    const day = await odEnsureChildFolder(t, dateStr, mtok);
    const cs = await odUploadString(day, `jobs-${dateStr}.csv`, "text/csv", csv, mtok);
    out.onedrive = { csv: cs };
  }
  return NextResponse.json(out);
}
