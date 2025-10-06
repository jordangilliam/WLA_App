import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ ok: true, provider: 'dropbox', note: 'Upload stub — implement me.' });
}
