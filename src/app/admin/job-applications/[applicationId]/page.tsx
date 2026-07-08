"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Download, Save, CheckCircle } from "lucide-react";

export default function CandidateDetailPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const resolvedParams = use(params);
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [resolvedParams.applicationId]);

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/admin/job-applications/${resolvedParams.applicationId}`);
      if (!res.ok) {
        throw new Error("Application not found");
      }
      const data = await res.json();
      setApp(data);
      setStatus(data.status || "New");
      setNotes(data.admin_notes || "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/admin/jobs/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: notes })
      });
      if (res.ok) {
        setSaveMessage("Saved successfully!");
        setApp({ ...app, status, admin_notes: notes });
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        throw new Error("Failed to save updates.");
      }
    } catch (e: any) {
      setSaveMessage("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const viewResume = async () => {
    try {
      const res = await fetch(`/api/admin/jobs/applications/${app.id}/resume`);
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

  const getStatusColor = (s: string) => {
    switch(s) {
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

  if (error || !app) {
    return (
      <div className="p-6">
        <Link href="/admin/job-applications" className="text-visionify-cyan font-semibold hover:underline mb-4 inline-flex items-center">
          <ArrowLeft size={16} className="mr-1"/> Back to Applications
        </Link>
        <div className="p-4 bg-red-50 text-red-700 rounded-xl font-medium">{error || "Not found"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/job-applications" className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-visionify-navy">Candidate Details</h1>
          <p className="text-gray-600">Applied for {app.jobTitle} on {new Date(app.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Application Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Reference Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Job Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="block text-gray-500 mb-1">Position</span>
                <span className="font-semibold text-visionify-navy">{app.jobTitle}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Department</span>
                <span className="font-semibold text-gray-900">{app.jobDepartment || '-'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Location</span>
                <span className="font-semibold text-gray-900">{app.jobLocation || '-'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Type</span>
                <span className="font-semibold text-gray-900">{app.jobType || '-'}</span>
              </div>
            </div>
            {app.jobDescription && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {app.jobDescription}
              </div>
            )}
          </div>

          {/* Applicant Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Full Name</span>
                <span className="font-bold text-lg text-visionify-navy">{app.full_name}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">City / Location</span>
                <span className="font-medium text-gray-900">{app.city}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Email Address</span>
                <a href={`mailto:${app.email}`} className="font-medium text-visionify-cyan hover:underline">{app.email}</a>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Phone Number</span>
                <a href={`tel:${app.phone}`} className="font-medium text-gray-900 hover:text-visionify-cyan">{app.phone}</a>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">LinkedIn URL</span>
                {app.linkedin_url ? (
                  <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-visionify-cyan hover:underline font-medium">
                    <ExternalLink size={14} className="mr-1" /> Open Profile
                  </a>
                ) : <span className="text-gray-400">Not provided</span>}
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Portfolio URL</span>
                {app.portfolio_url ? (
                  <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-visionify-cyan hover:underline font-medium">
                    <ExternalLink size={14} className="mr-1" /> Open Portfolio
                  </a>
                ) : <span className="text-gray-400">Not provided</span>}
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Motivation Letter / Cover Message</h3>
            <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
              {app.motivation}
            </div>
          </div>

          {/* Custom Answers */}
          {app.custom_answers && Object.keys(app.custom_answers).length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Custom Form Responses</h3>
              <div className="space-y-6">
                {Object.entries(app.custom_answers).map(([question, answer]) => (
                  <div key={question}>
                    <span className="block text-sm font-semibold text-gray-700 mb-2">{question}</span>
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                      {typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : String(answer)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Resume & Controls */}
        <div className="space-y-6">
          
          {/* Resume Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Resume / CV</h3>
            {app.resume_path ? (
              <button 
                onClick={viewResume}
                className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-visionify-cyan hover:bg-visionify-cyan/5 transition-all group"
              >
                <FileText size={40} className="text-gray-400 group-hover:text-visionify-cyan mb-3 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-visionify-cyan mb-1 line-clamp-1 break-all px-2 transition-colors">
                  {app.resume_file_name || "resume.pdf"}
                </span>
                <span className="text-xs text-gray-500 flex items-center mt-2 group-hover:text-visionify-cyan/70 transition-colors">
                  <Download size={14} className="mr-1" /> View securely (Signed URL)
                </span>
              </button>
            ) : (
              <div className="w-full p-6 bg-gray-50 rounded-xl border border-gray-100 text-center text-sm text-gray-500">
                No resume uploaded.
              </div>
            )}
          </div>

          {/* Admin Controls */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Admin Controls</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Application Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-visionify-cyan cursor-pointer ${getStatusColor(status)}`}
                >
                  <option value="New" className="bg-white text-gray-900 font-medium">New</option>
                  <option value="Under Review" className="bg-white text-gray-900 font-medium">Under Review</option>
                  <option value="Shortlisted" className="bg-white text-gray-900 font-medium">Shortlisted</option>
                  <option value="Interview Scheduled" className="bg-white text-gray-900 font-medium">Interview Scheduled</option>
                  <option value="Selected" className="bg-white text-gray-900 font-medium">Selected</option>
                  <option value="Rejected" className="bg-white text-gray-900 font-medium">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Private Admin Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this candidate here..."
                  rows={6}
                  className="w-full px-4 py-3 text-sm bg-yellow-50/30 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none placeholder-gray-400 text-gray-800"
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex justify-center items-center py-3 px-4 bg-visionify-navy text-white rounded-xl font-bold hover:bg-visionify-cyan transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? <span className="animate-pulse">Saving...</span> : <><Save size={18} className="mr-2" /> Save Updates</>}
            </button>
            
            {saveMessage && (
              <div className={`mt-4 p-3 rounded-xl text-sm text-center font-medium ${saveMessage.includes("Error") ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100 flex items-center justify-center gap-2"}`}>
                {!saveMessage.includes("Error") && <CheckCircle size={16} />}
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
