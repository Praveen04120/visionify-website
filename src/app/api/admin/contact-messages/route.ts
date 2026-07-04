import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("quote_requests")
    .select("*")
    .eq("form_type", "contact")
    .order("created_at", { ascending: false });

  // Map back to the expected contact_messages format for the frontend
  const mappedData = data ? data.map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    subject: item.project_type,
    message: item.project_details,
    status: item.status,
    created_at: item.created_at
  })) : [];

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mappedData);
}
