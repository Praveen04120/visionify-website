import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    
    // Check if job exists
    const { data: job, error: jobError } = await supabaseAdmin
      .from("job_openings")
      .select("title")
      .eq("id", resolvedParams.id)
      .single();

    if (jobError) throw jobError;

    const { data: applications, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("job_id", resolvedParams.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ jobTitle: job.title, applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
