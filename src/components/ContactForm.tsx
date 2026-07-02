"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
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
        <h3 className="text-xl font-bold text-visionify-navy mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6 font-medium text-sm">
          Thank you for reaching out. We will get back to you as soon as possible.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-full font-semibold text-visionify-navy bg-white border border-gray-200 hover:border-visionify-cyan shadow-sm transition-all text-sm"
        >
          Send Another Message
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
          <label htmlFor="contact_name" className="text-sm font-semibold text-visionify-navy">Full Name <span className="text-visionify-pink">*</span></label>
          <input 
            type="text" 
            id="contact_name" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="John Doe" 
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact_email" className="text-sm font-semibold text-visionify-navy">Email <span className="text-visionify-pink">*</span></label>
            <input 
              type="email" 
              id="contact_email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com" 
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact_phone" className="text-sm font-semibold text-visionify-navy">Phone (Optional)</label>
            <input 
              type="tel" 
              id="contact_phone" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210" 
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact_subject" className="text-sm font-semibold text-visionify-navy">Subject / Service <span className="text-visionify-pink">*</span></label>
          <select 
            id="contact_subject" 
            required 
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
          >
            <option value="" disabled>Select a subject</option>
            <option value="Event Banners">Event Banners</option>
            <option value="Brand Promotions">Brand Promotions</option>
            <option value="Logos">Logos & Identity</option>
            <option value="Business Cards">Business Cards</option>
            <option value="Wedding Cards / Invitations">Wedding Cards / Invitations</option>
            <option value="Private Party Posters">Private Party Posters</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact_message" className="text-sm font-semibold text-visionify-navy">Message <span className="text-visionify-pink">*</span></label>
          <textarea 
            id="contact_message" 
            required 
            rows={4} 
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            placeholder="How can we help you?" 
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none resize-none"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Sending..." : (
              <span className="flex items-center gap-2">
                Send Message <Send size={16} />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
