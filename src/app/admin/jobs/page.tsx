"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit, Trash2, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job and all its applications?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJobs();
      } else {
        alert("Failed to delete job.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (job: any) => {
    const newStatus = job.status === "Active" ? "Closed" : "Active";
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...job, status: newStatus })
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeJobs = jobs.filter(j => j.status === "Active").length;
  const closedJobs = jobs.filter(j => j.status === "Closed").length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.application_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-visionify-navy">Job Openings</h1>
          <p className="text-gray-600">Manage careers and applications</p>
        </div>
        <Link
          href="/admin/jobs/add"
          className="inline-flex items-center justify-center px-4 py-2 bg-visionify-navy text-white rounded-xl font-medium hover:bg-visionify-cyan transition-colors shadow-sm"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Job Opening
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-2"><Briefcase size={20} className="mr-2" /> Total Jobs</div>
          <div className="text-3xl font-bold text-visionify-navy">{jobs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-green-500 mb-2"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> Active Jobs</div>
          <div className="text-3xl font-bold text-visionify-navy">{activeJobs}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-red-500 mb-2"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Closed Jobs</div>
          <div className="text-3xl font-bold text-visionify-navy">{closedJobs}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-visionify-cyan mb-2"><Users size={20} className="mr-2" /> Total Apps</div>
          <div className="text-3xl font-bold text-visionify-navy">{totalApps}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-visionify-cyan"></div></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Position</th>
                  <th className="p-4">Type / Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applications</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <motion.tr 
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-visionify-navy">{job.title}</div>
                        <div className="text-sm text-gray-500">/{job.slug}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-800">{job.job_type || '-'}</div>
                        <div className="text-sm text-gray-500">{job.location || '-'}</div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStatus(job)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'Active' ? 'bg-green-100 text-green-700' : 
                            job.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {job.status}
                        </button>
                      </td>
                      <td className="p-4">
                        <Link 
                          href={`/admin/jobs/${job.id}/applications`}
                          className="inline-flex items-center text-visionify-cyan font-semibold hover:underline"
                        >
                          <Users size={16} className="mr-1" />
                          {job.application_count || 0}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/jobs/edit/${job.id}`}
                          className="inline-flex p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="inline-flex p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
