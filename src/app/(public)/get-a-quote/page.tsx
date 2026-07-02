"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, CheckCircle2 } from "lucide-react";

export default function GetAQuotePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        project_type: "",
        budget: "",
        details: ""
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen selection:bg-visionify-cyan selection:text-white pt-28 pb-20">
      {/* Abstract Background Elements */}
      <div className="fixed top-[10%] right-[-10%] w-[40%] h-[400px] bg-purple-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[400px] bg-cyan-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-visionify-navy hover:text-visionify-cyan font-medium mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Header & Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 animate-[fadeInUp_0.8s_ease-out]">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-visionify-pink/30 text-visionify-purple text-sm font-bold tracking-widest uppercase mb-6">
              <Sparkles size={16} /> Start a Project
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-visionify-navy mb-6">
              Let's build <br className="hidden lg:block"/> something <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple">beautiful.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md font-medium leading-relaxed">
              Fill out the form with your project details, and we'll get back to you with a custom quote tailored to your vision.
            </p>
            
            <div className="hidden lg:block p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 shadow-sm">
              <h3 className="font-bold text-visionify-navy mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-3 font-medium">
                <li className="flex gap-3"><span className="text-visionify-cyan">1.</span> We review your requirements.</li>
                <li className="flex gap-3"><span className="text-visionify-cyan">2.</span> We schedule a quick consultation call.</li>
                <li className="flex gap-3"><span className="text-visionify-cyan">3.</span> You receive a detailed proposal and quote.</li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7 animate-[fadeInUp_1s_ease-out]">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgba(10,16,61,0.04)] relative">
              <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-visionify-cyan to-visionify-purple rounded-b-full"></div>
              
              {success ? (
                <div className="py-12 text-center animate-[fadeIn_0.5s_ease-out]">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-visionify-navy mb-4">Request Submitted!</h3>
                  <p className="text-gray-600 max-w-sm mx-auto mb-8 font-medium">
                    Thank you for reaching out. We have received your project details and will be in touch shortly.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-full font-semibold text-visionify-navy bg-white border border-gray-200 hover:border-visionify-cyan shadow-sm transition-all"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-visionify-navy">Full Name <span className="text-visionify-pink">*</span></label>
                      <input 
                        type="text" 
                        id="name" 
                        required 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-visionify-navy">Email Address <span className="text-visionify-pink">*</span></label>
                      <input 
                        type="email" 
                        id="email" 
                        required 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-visionify-navy">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 98765 43210" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="project_type" className="text-sm font-semibold text-visionify-navy">Project Type <span className="text-visionify-pink">*</span></label>
                      <select 
                        id="project_type" 
                        required 
                        value={formData.project_type}
                        onChange={e => setFormData({...formData, project_type: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="event-banners">Event Banners</option>
                        <option value="brand-promotions">Brand Promotions</option>
                        <option value="logos">Logos & Identity</option>
                        <option value="business-cards">Business Cards</option>
                        <option value="wedding-cards">Wedding & Invitations</option>
                        <option value="multiple">Multiple Categories</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-semibold text-visionify-navy">Estimated Budget (Optional)</label>
                    <select 
                      id="budget" 
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-cyan focus:ring-2 focus:ring-visionify-cyan/20 transition-all outline-none text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
                    >
                      <option value="" disabled>Select budget range</option>
                      <option value="under-10k">Under ₹10,000</option>
                      <option value="10k-25k">₹10,000 - ₹25,000</option>
                      <option value="25k-50k">₹25,000 - ₹50,000</option>
                      <option value="50k+">₹50,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="details" className="text-sm font-semibold text-visionify-navy">Project Details <span className="text-visionify-pink">*</span></label>
                    <textarea 
                      id="details" 
                      required 
                      rows={4} 
                      value={formData.details}
                      onChange={e => setFormData({...formData, details: e.target.value})}
                      placeholder="Tell us about your vision, requirements, and any specific deadlines..." 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-visionify-purple focus:ring-2 focus:ring-visionify-purple/20 transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full flex items-center justify-center min-h-[56px] px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-[0_8px_20px_rgba(34,230,213,0.3)] hover:shadow-[0_12px_25px_rgba(110,30,219,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group relative overflow-hidden disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? "Sending..." : "Submit Request"}
                        {!loading && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full skew-x-[-20deg] transition-all duration-700 group-hover:translate-x-[200%] z-0 pointer-events-none"></div>
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-4 font-medium">
                      By submitting this form, you agree to allow us to contact you regarding your project.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
