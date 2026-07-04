"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Calendar, Trash2, MapPin, Users } from "lucide-react";

export default function CommunityApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/community");
      if (res.ok) setApps(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/community/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedApp = await res.json();
        setApps(apps.map(a => a.id === id ? updatedApp : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/admin/community/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApps(apps.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = filter === "all" ? apps : apps.filter(a => a.status === filter);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading applications...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-visionify-navy">Community Applications</h1>
          <p className="text-gray-500 mt-1">Manage partnership requests from communities and groups.</p>
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-visionify-cyan"
        >
          <option value="all">All Applications</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="approved">Approved</option>
          <option value="closed">Closed / Finished</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100 flex flex-col items-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
            <p>No community applications found.</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative group">
              <button 
                onClick={() => handleDelete(app.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Request"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-visionify-navy">{app.name}</h2>
                    <span className="text-sm font-medium text-visionify-purple bg-visionify-purple/10 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                      <Users size={14}/> {app.community_name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><Mail size={16} className="text-gray-400"/> {app.email}</span>
                    {app.phone && <span className="flex items-center gap-1.5"><Phone size={16} className="text-gray-400"/> {app.phone}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Community Message / Requirements</label>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
                    {app.message}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 font-medium">
                  Received: {new Date(app.created_at).toLocaleString()}
                </div>
              </div>

              <div className="md:w-64 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div>
                  <label className="block text-sm font-bold text-visionify-navy mb-2">Status</label>
                  <select 
                    value={app.status || 'new'}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none font-semibold text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_0.5rem_center] bg-no-repeat pr-8
                      ${app.status === 'new' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500/20' : 
                        app.status === 'contacted' ? 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-2 focus:ring-amber-500/20' : 
                        'bg-green-50 border-green-200 text-green-700 focus:ring-2 focus:ring-green-500/20'}`}
                  >
                    <option value="new">New Application</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="closed">Closed / Finished</option>
                  </select>
                </div>
                
                <a 
                  href={`mailto:${app.email}?subject=Reply from Visionify regarding your Community Collaboration Application`}
                  className="mt-4 md:mt-0 w-full flex items-center justify-center gap-2 py-2.5 bg-visionify-navy hover:bg-visionify-electric text-white rounded-xl font-bold transition-colors text-sm"
                >
                  <Mail size={16}/> Reply via Email
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
