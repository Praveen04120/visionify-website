import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .select("*")
      .eq("id", resolvedParams.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const resolvedParams = await context.params;

    if (!payload.title || !payload.slug || !payload.short_description || !payload.full_description || !payload.perks) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .update(payload)
      .eq("id", resolvedParams.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "A job with this URL slug already exists." }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resolvedParams = await context.params;
    
    // Deleting the job will cascade delete applications in Supabase if ON DELETE CASCADE is set.
    // However, we should ideally also delete the resumes from the storage bucket.
    // To do this, we'd need to fetch all applications for this job and delete their resumes.
    const { data: apps } = await supabaseAdmin
      .from("job_applications")
      .select("resume_path")
      .eq("job_id", resolvedParams.id)
      .not("resume_path", "is", null);

    if (apps && apps.length > 0) {
      const pathsToDelete = apps.map(app => app.resume_path).filter(Boolean) as string[];
      if (pathsToDelete.length > 0) {
        await supabaseAdmin.storage.from("job-resumes").remove(pathsToDelete);
      }
    }

    const { error } = await supabaseAdmin
      .from("job_openings")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
