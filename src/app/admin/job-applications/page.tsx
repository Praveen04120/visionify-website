"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";

export default function GlobalJobApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/admin/job-applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uniqueJobs = Array.from(new Set(applications.map(app => app.jobTitle))).filter(Boolean);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    const matchesJob = selectedJob ? app.jobTitle === selectedJob : true;
    const matchesStatus = selectedStatus ? app.status === selectedStatus : true;
    return matchesSearch && matchesJob && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Shortlisted': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Selected': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-visionify-cyan"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-visionify-navy">All Job Applications</h1>
        <p className="text-gray-600">Review candidates across all job openings</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidate name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan transition-shadow"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedJob} 
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan appearance-none"
              >
                <option value="">All Jobs</option>
                {uniqueJobs.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredApps.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No applications match your filters.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-200 shadow-sm">
                <tr className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied On</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-visionify-navy">{app.full_name}</div>
                      <div className="text-sm text-gray-500">{app.city}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-800">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-visionify-navy">{app.jobTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(app.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/job-applications/${app.id}`}
                        className="inline-flex items-center px-4 py-1.5 bg-visionify-cyan/10 text-visionify-cyan text-sm font-semibold rounded-lg hover:bg-visionify-cyan hover:text-white transition-colors"
                      >
                        <Eye size={16} className="mr-1.5" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
