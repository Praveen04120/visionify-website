import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function PUT(request: Request, context: any) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("portfolio_categories")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;

    // Check if category has items before deleting
    // First, get the slug of the category
    const { data: category } = await supabaseAdmin
      .from("portfolio_categories")
      .select("slug")
      .eq("id", id)
      .single();

    if (category) {
      const { count } = await supabaseAdmin
        .from("portfolio_items")
        .select("*", { count: 'exact', head: true })
        .eq("category", category.slug);

      if (count && count > 0) {
        return NextResponse.json({ error: "Cannot delete category because it has portfolio items." }, { status: 400 });
      }
    }

    const { error } = await supabaseAdmin
      .from("portfolio_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
