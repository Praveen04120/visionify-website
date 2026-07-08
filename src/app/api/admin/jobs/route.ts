import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySession } from "@/lib/session";

export async function GET() {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .select(`
        *,
        applications:job_applications(count)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    
    // Map data to easily expose application counts
    const mapped = data.map(job => ({
      ...job,
      application_count: job.applications?.[0]?.count || 0
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await verifySession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    
    if (!payload.title || !payload.slug || !payload.short_description || !payload.full_description || !payload.perks) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        return NextResponse.json({ error: "A job with this URL slug already exists. Please change the title or slug." }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
