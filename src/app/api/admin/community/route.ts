import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch community applications from quote_requests table
  const { data, error } = await supabaseAdmin
    .from("quote_requests")
    .select("*")
    .neq("budget_range", "Contact Form")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map back to community applications format
  const mappedData = data ? data.map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    community_name: item.project_type,
    event_date: item.budget_range,
    message: item.project_details,
    status: item.status,
    created_at: item.created_at
  })) : [];

  return NextResponse.json(mappedData);
}
