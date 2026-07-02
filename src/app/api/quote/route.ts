import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, project_type, budget, details } = body;

    if (!name || !email || !project_type || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          project_type,
          budget_range: budget || null,
          project_details: details,
          status: 'new'
        }
      ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
