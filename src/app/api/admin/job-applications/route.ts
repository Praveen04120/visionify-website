import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select(`
        *,
        job:job_openings(title, department, location)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Flatten job data for easier frontend use
    const mapped = data.map(app => ({
      ...app,
      jobTitle: app.job?.title || "Unknown Position",
      jobDepartment: app.job?.department || "",
      jobLocation: app.job?.location || ""
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
