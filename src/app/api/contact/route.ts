import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields including phone number" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          project_type: subject,
          budget_range: "Contact Form",
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
