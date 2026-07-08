"use client";

import { useEffect, useState, use } from "react";
import JobForm from "@/components/admin/JobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/admin/jobs/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-visionify-cyan"></div></div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Link href="/admin/jobs" className="text-visionify-cyan font-semibold hover:underline mb-4 inline-flex items-center">
          <ArrowLeft size={16} className="mr-1"/> Back
        </Link>
        <div className="p-4 bg-red-50 text-red-700 rounded-xl font-medium">{error}</div>
      </div>
    );
  }

  return <JobForm initialData={job} isEditing={true} />;
}
