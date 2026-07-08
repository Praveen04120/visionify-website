import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { 
      job_id, 
      full_name, 
      email, 
      phone, 
      city, 
      linkedin_url, 
      portfolio_url, 
      motivation, 
      custom_answers, 
      resume_path, 
      resume_file_name 
    } = payload;

    if (!job_id || !full_name || !email || !phone || !city || !motivation) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Double check that job is active and accepts applications
    const { data: job, error: jobError } = await supabaseAdmin
      .from("job_openings")
      .select("status, accepts_applications, application_deadline, resume_required")
      .eq("id", job_id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "Active" || !job.accepts_applications) {
       return NextResponse.json({ success: false, error: "This opening is no longer accepting applications" }, { status: 403 });
    }

    if (job.application_deadline && new Date(job.application_deadline) < new Date()) {
       return NextResponse.json({ success: false, error: "The deadline for this position has passed." }, { status: 403 });
    }

    if (job.resume_required && !resume_path) {
       return NextResponse.json({ success: false, error: "A resume is required for this position." }, { status: 400 });
    }

    // Insert the application
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .insert([{
        job_id, 
        full_name, 
        email, 
        phone, 
        city, 
        linkedin_url, 
        portfolio_url, 
        motivation, 
        custom_answers: custom_answers || {}, 
        resume_path, 
        resume_file_name,
        status: "New"
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, application_id: data.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to submit application" }, { status: 500 });
  }
}
