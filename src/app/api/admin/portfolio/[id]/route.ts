import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, category, description, display_order, is_active } = body;

    if (category) {
      // Verify category exists
      const { data: categoryData } = await supabaseAdmin
        .from("portfolio_categories")
        .select("slug")
        .eq("slug", category)
        .single();
        
      if (!categoryData) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_items")
      .update({
        title,
        category,
        description,
        display_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resolvedParams.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await params;
    
    // First, get the item to find its image_url
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("portfolio_items")
      .select("image_url")
      .eq("id", resolvedParams.id)
      .single();

    if (fetchError) throw fetchError;

    // Try to delete the image from storage if it's hosted on our supabase bucket
    if (item && item.image_url) {
      // The image_url will look like: https://[project].supabase.co/storage/v1/object/public/portfolio-images/filename.jpg
      // We need to extract the filename/path inside the bucket
      const urlParts = item.image_url.split('/portfolio-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        // Don't await/block on storage deletion failure
        await supabaseAdmin.storage.from('portfolio-images').remove([filePath]);
      }
    }

    // Delete the database record
    const { error: deleteError } = await supabaseAdmin
      .from("portfolio_items")
      .delete()
      .eq("id", resolvedParams.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
