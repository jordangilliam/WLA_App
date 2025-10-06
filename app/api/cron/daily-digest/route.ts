import { NextRequest, NextResponse } from "next/server";
import { requireCron } from "@/app/api/cron/_auth";

export async function POST(req: NextRequest){
  const unauthorized = requireCron(req);
  if (unauthorized) return unauthorized;

  const payload = await req.json().catch(()=>({}));
  // Forward to internal automation route (requires an admin to be signed in if session-bound)
  // Here we simply return the payload so you can schedule a POST with sessions included (from a published CSV/JSON).
  // For production, wire a service account or store a minimal cache.
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/automations/daily-digest`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', cookie: '' },
    body: JSON.stringify(payload)
  });
  const out = await res.json().catch(()=>({}));
  return NextResponse.json(out, { status: res.status });
}
