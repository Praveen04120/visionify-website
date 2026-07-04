import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (sessionToken !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, image_url, description, display_order, is_active } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("portfolio_items")
      .update({
        title,
        image_url,
        description,
        display_order,
        is_active
      })
      .eq("id", (await context.params).id)
      .eq("category", "_collaborators_")
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (sessionToken !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("portfolio_items")
      .select("image_url")
      .eq("id", (await context.params).id)
      .eq("category", "_collaborators_")
      .single();

    if (fetchError) throw fetchError;

    if (item && item.image_url) {
      const urlParts = item.image_url.split('/portfolio-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabaseAdmin.storage.from('portfolio-images').remove([filePath]);
      }
    }

    const { error } = await supabaseAdmin
      .from("portfolio_items")
      .delete()
      .eq("id", (await context.params).id)
      .eq("category", "_collaborators_");

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
