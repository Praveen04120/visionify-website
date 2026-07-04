import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, image_url, description, display_order, is_active } = await request.json();
    const resolvedParams = await context.params;

    const { data, error } = await supabaseAdmin
      .from("portfolio_items")
      .update({
        title,
        image_url,
        description: description || "",
        display_order: display_order || 0,
        is_active: is_active ?? true
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    
    // 1. Fetch item to get the image URL
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("portfolio_items")
      .select("image_url")
      .eq("id", resolvedParams.id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // 2. Extract path and delete from storage
    if (item?.image_url) {
      try {
        const urlObj = new URL(item.image_url);
        const pathParts = urlObj.pathname.split('/portfolio-images/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabaseAdmin.storage.from("portfolio-images").remove([filePath]);
        }
      } catch (e) {
        console.error("Storage cleanup failed:", e);
      }
    }

    // 3. Delete from DB
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
