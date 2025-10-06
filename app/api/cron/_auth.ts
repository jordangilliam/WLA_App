import { NextRequest, NextResponse } from "next/server";

function auth(req: NextRequest){
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const ok = token && process.env.CRON_SECRET && token === process.env.CRON_SECRET;
  return ok;
}

export function requireCron(req: NextRequest){
  if (!auth(req)) {
    return NextResponse.json({ ok:false, error:'Unauthorized' }, { status: 401 });
  }
  return null;
}
