"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Download, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [jobTitle, setJobTitle] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [resolvedParams.id]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/admin/jobs/${resolvedParams.id}/applications`);
      if (res.ok) {
        const data = await res.json();
        setJobTitle(data.jobTitle);
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications(apps => apps.map(app => app.id === appId ? { ...app, status } : app));
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateNotes = async (appId: string, notes: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes })
      });
      if (res.ok) {
        setApplications(apps => apps.map(app => app.id === appId ? { ...app, admin_notes: notes } : app));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const viewResume = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/applications/${appId}/resume`);
      if (res.ok) {
        const data = await res.json();
        if (data.signedUrl) {
          window.open(data.signedUrl, "_blank");
        }
      } else {
        alert("Could not fetch resume. It may have been deleted.");
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching resume.");
    }
  };

  const filteredApps = applications.filter(app => 
    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Reviewed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Interviewing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Hired': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-visionify-cyan"></div></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs" className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-visionify-navy">Applications</h1>
          <p className="text-gray-600">{jobTitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)]">
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-visionify-navy text-lg">{applications.length} Candidates</span>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan transition-shadow"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredApps.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No applications found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 shadow-sm z-10">
                <tr className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4 w-1/4">Applicant</th>
                  <th className="p-4 w-1/4">Contact</th>
                  <th className="p-4 w-[15%]">Status</th>
                  <th className="p-4 w-[15%]">Date</th>
                  <th className="p-4 w-1/4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="p-4">
                      <div className="font-bold text-visionify-navy">{app.full_name}</div>
                      <div className="text-sm text-gray-500">{app.city}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-800">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                        className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-visionify-navy/40 backdrop-blur-sm"
              onClick={() => setSelectedApp(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-visionify-navy">{selectedApp.full_name}</h2>
                  <p className="text-gray-500 text-sm">Applied for {jobTitle} on {new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-visionify-cyan cursor-pointer ${getStatusColor(selectedApp.status)}`}
                  >
                    <option value="New" className="bg-white text-gray-900">New</option>
                    <option value="Reviewed" className="bg-white text-gray-900">Reviewed</option>
                    <option value="Interviewing" className="bg-white text-gray-900">Interviewing</option>
                    <option value="Hired" className="bg-white text-gray-900">Hired</option>
                    <option value="Rejected" className="bg-white text-gray-900">Rejected</option>
                  </select>
                  <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column (Info) */}
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Applicant Info</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-500 mb-1">Email</span>
                        <a href={`mailto:${selectedApp.email}`} className="font-medium text-visionify-cyan hover:underline">{selectedApp.email}</a>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">Phone</span>
                        <a href={`tel:${selectedApp.phone}`} className="font-medium text-gray-900 hover:text-visionify-cyan">{selectedApp.phone}</a>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">Location / City</span>
                        <span className="font-medium text-gray-900">{selectedApp.city}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-gray-500 mb-1">Links</span>
                        {selectedApp.linkedin_url && (
                          <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-visionify-cyan hover:underline font-medium">
                            <ExternalLink size={14} className="mr-1" /> LinkedIn
                          </a>
                        )}
                        {selectedApp.portfolio_url && (
                          <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-visionify-cyan hover:underline font-medium mt-1">
                            <ExternalLink size={14} className="mr-1" /> Portfolio
                          </a>
                        )}
                        {!selectedApp.linkedin_url && !selectedApp.portfolio_url && <span className="text-gray-400">None provided</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Motivation</h3>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap leading-relaxed border border-gray-100">
                      {selectedApp.motivation}
                    </div>
                  </div>

                  {selectedApp.custom_answers && Object.keys(selectedApp.custom_answers).length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Custom Responses</h3>
                      <div className="space-y-4">
                        {Object.entries(selectedApp.custom_answers).map(([key, value]) => (
                          <div key={key}>
                            <span className="block text-sm font-semibold text-gray-700 mb-1">{key}</span>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (Actions & Notes) */}
                <div className="space-y-6 md:border-l md:border-gray-100 md:pl-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Resume / CV</h3>
                    {selectedApp.resume_path ? (
                      <button 
                        onClick={() => viewResume(selectedApp.id)}
                        className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-visionify-cyan hover:bg-visionify-cyan/5 transition-all group"
                      >
                        <FileText size={32} className="text-gray-400 group-hover:text-visionify-cyan mb-3" />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-visionify-cyan mb-1 line-clamp-1 break-all px-2">
                          {selectedApp.resume_file_name || "resume.pdf"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center mt-2 group-hover:text-visionify-cyan/70">
                          <Download size={14} className="mr-1" /> View / Download securely
                        </span>
                      </button>
                    ) : (
                      <div className="w-full p-6 bg-gray-50 rounded-xl border border-gray-100 text-center text-sm text-gray-500">
                        No resume attached.
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Admin Notes</h3>
                    <textarea 
                      defaultValue={selectedApp.admin_notes || ""}
                      onBlur={(e) => {
                        if (e.target.value !== selectedApp.admin_notes) {
                          updateNotes(selectedApp.id, e.target.value);
                          setSelectedApp({ ...selectedApp, admin_notes: e.target.value });
                        }
                      }}
                      placeholder="Add private notes about this candidate here. Saved automatically on blur."
                      rows={8}
                      className="w-full px-4 py-3 text-sm bg-yellow-50/50 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-2">Notes are auto-saved when you click outside the box.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
