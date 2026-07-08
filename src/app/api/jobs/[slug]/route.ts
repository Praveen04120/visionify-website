import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .select("*")
      .eq("slug", resolvedParams.slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      throw error;
    }

    if (data.status !== "Active" || !data.accepts_applications) {
       return NextResponse.json({ error: "This opening is no longer accepting applications" }, { status: 403 });
    }
    
    if (data.application_deadline) {
      const now = new Date();
      if (new Date(data.application_deadline) < now) {
         return NextResponse.json({ error: "This opening is no longer accepting applications" }, { status: 403 });
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch job" }, { status: 500 });
  }
}
