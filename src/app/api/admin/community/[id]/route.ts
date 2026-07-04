import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (sessionToken !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const { data, error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", (await context.params).id)
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
    const { error } = await supabase
      .from("quote_requests")
      .delete()
      .eq("id", (await context.params).id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
