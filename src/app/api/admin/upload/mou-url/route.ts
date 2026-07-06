import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fileName, fileType, fileSize } = await request.json();
    
    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    if (!fileName.toLowerCase().endsWith('.pdf') || fileType !== 'application/pdf') {
      return NextResponse.json({ success: false, error: "Only PDF files are allowed." }, { status: 400 });
    }

    if (fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Only PDF files up to 10 MB are allowed." }, { status: 400 });
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${crypto.randomUUID()}/${Date.now()}-mou.pdf`; // No leading 'partner-mous/' because we are IN the partner-mous bucket now

    // Generate signed upload URL
    const { data, error } = await supabaseAdmin
      .storage
      .from('partner-mous')
      .createSignedUploadUrl(path);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      path: path,
      token: data.token,
      bucket: 'partner-mous'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
