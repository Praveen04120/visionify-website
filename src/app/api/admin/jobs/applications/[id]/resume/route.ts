import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    
    // 1. Get the application to find the resume_path
    const { data: app, error: fetchError } = await supabaseAdmin
      .from("job_applications")
      .select("resume_path")
      .eq("id", resolvedParams.id)
      .single();

    if (fetchError) throw fetchError;
    if (!app || !app.resume_path) {
      return NextResponse.json({ error: "No resume attached" }, { status: 404 });
    }

    // 2. Generate signed URL valid for 60 seconds (1 minute)
    const { data, error } = await supabaseAdmin
      .storage
      .from("job-resumes")
      .createSignedUrl(app.resume_path, 60);

    if (error) {
      throw error;
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
