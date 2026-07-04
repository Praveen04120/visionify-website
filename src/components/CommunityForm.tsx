"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function CommunityForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    community_name: "",
    email: "",
    phone: "",
    event_date: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");

      setSuccess(true);
      setFormData({
        name: "",
        community_name: "",
        email: "",
        phone: "",
        event_date: "",
        message: ""
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm text-center animate-[fadeIn_0.5s_ease-out]">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-visionify-navy mb-2">Application Received!</h3>
        <p className="text-gray-600 mb-6 font-medium text-sm">
          Thank you for reaching out to partner with us. We'll review your details and get back to you soon.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-full font-semibold text-visionify-navy bg-white border border-gray-200 hover:border-visionify-cyan shadow-sm transition-all text-sm"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="comm_name" className="text-sm font-semibold text-visionify-navy">Full Name <span className="text-visionify-pink">*</span></label>
          <input 
            type="text" 
            id="comm_name" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="John Doe" 
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="comm_group" className="text-sm font-semibold text-visionify-navy">Community / Group Name <span className="text-visionify-pink">*</span></label>
          <input 
            type="text" 
            id="comm_group" 
            required 
            value={formData.community_name}
            onChange={e => setFormData({...formData, community_name: e.target.value})}
            placeholder="e.g. University Tech Club" 
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="comm_email" className="text-sm font-semibold text-visionify-navy">Email <span className="text-visionify-pink">*</span></label>
            <input 
              type="email" 
              id="comm_email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com" 
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="comm_phone" className="text-sm font-semibold text-visionify-navy">Phone (Optional)</label>
            <input 
              type="tel" 
              id="comm_phone" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210" 
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="comm_date" className="text-sm font-semibold text-visionify-navy">Expected Event Date <span className="text-visionify-pink">*</span></label>
          <input 
            type="date" 
            id="comm_date" 
            required 
            value={formData.event_date}
            onChange={e => setFormData({...formData, event_date: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none text-gray-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="comm_message" className="text-sm font-semibold text-visionify-navy">Message / Proposal <span className="text-visionify-pink">*</span></label>
          <textarea 
            id="comm_message" 
            required 
            rows={4} 
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            placeholder="Tell us about your event and how we can collaborate..." 
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none resize-none"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Submitting..." : (
              <span className="flex items-center gap-2">
                Submit Proposal <Send size={16} />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
