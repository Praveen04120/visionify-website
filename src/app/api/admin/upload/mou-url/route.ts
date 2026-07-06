import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `partner-mous/${crypto.randomUUID()}/${sanitizedName}`;

    // Generate signed upload URL
    const { data, error } = await supabaseAdmin
      .storage
      .from('portfolio-images')
      .createSignedUploadUrl(path);

    if (error) {
      throw error;
    }

    // Get the final public URL that will be active once uploaded
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('portfolio-images')
      .getPublicUrl(path);

    return NextResponse.json({ 
      success: true, 
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
