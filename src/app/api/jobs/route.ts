import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .select("*")
      .eq("status", "Active")
      .eq("accepts_applications", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Optionally filter out expired deadlines here, but we can also just trust the DB
    const now = new Date();
    const activeJobs = data.filter(job => {
      if (!job.application_deadline) return true;
      return new Date(job.application_deadline) >= now;
    });

    return NextResponse.json(activeJobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch jobs" }, { status: 500 });
  }
}
