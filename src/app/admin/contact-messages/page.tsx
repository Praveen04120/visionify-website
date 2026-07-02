"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, AlertCircle } from "lucide-react";

export default function ContactMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contact-messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading contact messages...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-visionify-navy mb-8">Contact Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
          <p>No contact messages received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col gap-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="min-w-0 flex-1 w-full">
                  <h3 className="text-xl font-bold text-visionify-navy truncate pr-2">{msg.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-2 truncate"><Mail size={16} className="shrink-0"/> <span className="truncate">{msg.email}</span></span>
                    {msg.phone && <span className="flex items-center gap-2 truncate"><Phone size={16} className="shrink-0"/> <span className="truncate">{msg.phone}</span></span>}
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-gray-400 order-2 sm:order-1">
                    <Calendar size={14}/> <span className="hidden sm:inline">{formatDate(msg.created_at)}</span>
                  </span>
                  <select 
                    value={msg.status}
                    onChange={(e) => updateStatus(msg.id, e.target.value)}
                    className={`text-sm font-bold px-3 py-2 sm:py-1.5 rounded-lg border outline-none cursor-pointer w-full sm:w-auto order-1 sm:order-2
                      ${msg.status === 'new' ? 'bg-red-50 text-red-600 border-red-200' : 
                        msg.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                        'bg-gray-100 text-gray-600 border-gray-200'}
                    `}
                  >
                    <option value="new">New Message</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed / Finished</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                <div className="mb-3 text-sm">
                  <span className="font-semibold text-visionify-navy block sm:inline">Subject / Service:</span> {msg.subject}
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-wrap mt-2 pt-2 border-t border-gray-200">
                  <span className="font-semibold text-visionify-navy block mb-1">Message:</span>
                  {msg.message}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
