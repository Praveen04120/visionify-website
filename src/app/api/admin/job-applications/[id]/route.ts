import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select(`
        *,
        job:job_openings(title, department, location, job_type, short_description)
      `)
      .eq("id", resolvedParams.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      throw error;
    }

    const mapped = {
      ...data,
      jobTitle: data.job?.title || "Unknown Position",
      jobDepartment: data.job?.department || "",
      jobLocation: data.job?.location || "",
      jobType: data.job?.job_type || "",
      jobDescription: data.job?.short_description || ""
    };

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
