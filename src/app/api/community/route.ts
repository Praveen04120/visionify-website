import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, community_name, email, phone, event_date, message } = body;

    if (!name || !community_name || !email || !event_date || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since quote_requests table is already created in Supabase from previous setup,
    // and the user wants a zero-friction experience without running new SQL,
    // we map community applications to quote_requests table fields.
    // project_type -> community_name
    // budget_range -> event_date
    // project_details -> message
    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          project_type: community_name,
          budget_range: event_date,
          project_details: message,
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
