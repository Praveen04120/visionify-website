import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

const validCategories = [
  "event-banners",
  "brand-promotions",
  "logos",
  "business-cards",
  "wedding-cards",
  "private-party-posters"
];

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, category, image_url, description, display_order, is_active } = body;

    if (!title || !category || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_items")
      .insert([
        {
          title,
          category,
          image_url,
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
