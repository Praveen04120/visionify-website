import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, community_name, email, phone, message } = body;

    if (!name || !community_name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          name,
          email,
          phone,
          project_type: "Community Collaboration",
          budget_range: community_name, // Temporarily store community_name in budget_range if we don't have another field, or wait, user said form_type="community_collaboration", project_type="Community Collaboration", project_details=message. Let's see mapping!
          project_details: message,
          form_type: 'community_collaboration',
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
