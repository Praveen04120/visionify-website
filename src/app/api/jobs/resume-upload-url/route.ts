import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { fileName, fileType, fileSize, jobId } = await request.json();
    
    if (!fileName || !fileType || !fileSize || !jobId) {
      return NextResponse.json({ success: false, error: "Invalid payload. Missing required fields." }, { status: 400 });
    }

    if (!fileName.toLowerCase().endsWith('.pdf') || fileType !== 'application/pdf') {
      return NextResponse.json({ success: false, error: "Only PDF files are allowed." }, { status: 400 });
    }

    if (fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Only PDF files up to 10 MB are allowed." }, { status: 400 });
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${jobId}/${crypto.randomUUID()}/${Date.now()}-${sanitizedName}`;

    // Generate signed upload URL in the job-resumes bucket
    const { data, error } = await supabaseAdmin
      .storage
      .from('job-resumes')
      .createSignedUploadUrl(path);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      path: path,
      token: data.token,
      bucket: 'job-resumes'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
