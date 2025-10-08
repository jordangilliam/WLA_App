import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";

export async function POST(req: NextRequest){
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok:false, error:'Not authenticated' }, { status: 401 });

  const { policyDays = 180 } = await req.json();
  // NOTE: With drive.file scope we can only see files our app created.
  // For now, produce a simple plan and require a manual review step.
  const plan = {
    policyDays,
    recommendation: `Review app-created files older than ${policyDays} days in WLA/Admin/* and WLA/Exports/* and move to Archive or delete.`,
    // A real implementation would list file IDs by querying parent folders and filtering by createdTime/modifiedTime.
  };
  return NextResponse.json({ ok:true, plan });
}
