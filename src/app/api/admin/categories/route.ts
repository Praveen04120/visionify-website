import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("portfolio_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, slug, description, display_order, is_active } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_categories")
      .insert([
        {
          name,
          slug,
          description: description || null,
          display_order: display_order || 0,
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
