import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, and PDF allowed" }, { status: 400 });
    }

    // Generate unique path
    const isPdf = file.type === "application/pdf";
    const ext = file.name.split('.').pop() || (isPdf ? 'pdf' : 'jpg');
    let filename = `${crypto.randomUUID()}.${ext}`;
    
    if (isPdf) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      filename = `partner-mous/${crypto.randomUUID()}/${sanitizedName}`;
    }
    
    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase using Admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .storage
      .from('portfolio-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('portfolio-images')
      .getPublicUrl(filename);

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
