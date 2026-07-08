"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface JobOpening {
  id: string;
  title: string;
  slug: string;
  job_type: string;
  location: string;
  full_description: string;
  responsibilities: string;
  requirements: string;
  perks: string;
  application_deadline: string;
  resume_required: boolean;
  custom_fields: any[];
}

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<any>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${resolvedParams.slug}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Job not found");
        }
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [resolvedParams.slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev: any) => ({
      ...prev,
      custom_answers: {
        ...(prev.custom_answers || {}),
        [name]: finalValue
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSubmitError("");
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
        setSubmitError("Only PDF files are allowed.");
        setResumeFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError("File size must be less than 10MB.");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    
    setSubmitting(true);
    setSubmitError("");
    
    try {
      if (job.resume_required && !resumeFile) {
        throw new Error("Resume PDF is required.");
      }

      let finalResumePath = null;
      let finalResumeName = null;

      if (resumeFile) {
        // 1. Get signed url for resume
        const signedRes = await fetch("/api/jobs/resume-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: resumeFile.name,
            fileType: resumeFile.type,
            fileSize: resumeFile.size,
            jobId: job.id
          })
        });

        let signedData;
        try {
          signedData = await signedRes.json();
        } catch(err) {
          throw new Error("Upload service returned an invalid response. Please try again.");
        }

        if (!signedRes.ok || !signedData.success) {
          throw new Error(signedData.error || "Failed to generate upload URL");
        }

        // 2. Upload direct to Supabase
        const { error: uploadError } = await supabase.storage
          .from(signedData.bucket)
          .uploadToSignedUrl(signedData.path, signedData.token, resumeFile, {
            contentType: 'application/pdf',
          });

        if (uploadError) {
          throw new Error("Failed to upload resume: " + uploadError.message);
        }

        finalResumePath = signedData.path;
        finalResumeName = resumeFile.name;
      }

      // 3. Submit application
      const payload = {
        job_id: job.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        motivation: formData.motivation,
        custom_answers: formData.custom_answers || {},
        resume_path: finalResumePath,
        resume_file_name: finalResumeName
      };

      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let resData;
      try {
        resData = await res.json();
      } catch(err) {
        throw new Error("Application service returned an invalid response.");
      }

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to submit application");
      }

      setSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-visionify-blush flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-visionify-cyan"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-visionify-blush pt-32 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Job Not Found"}</h2>
          <Link href="/jobs" className="text-visionify-cyan font-semibold hover:underline">
            ← Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-visionify-blush pt-32 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-visionify-navy mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for applying to the <span className="font-semibold">{job.title}</span> position. We have received your application and will be in touch soon.
          </p>
          <Link href="/jobs" className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white bg-visionify-navy hover:bg-visionify-cyan transition-colors">
            ← Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-visionify-blush pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/jobs" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-visionify-cyan mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-visionify-navy mb-6">{job.title}</h1>
          <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-100 pb-8">
            {job.job_type && (
              <span className="flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-full font-medium">
                <Briefcase size={18} className="mr-2" />
                {job.job_type}
              </span>
            )}
            {job.location && (
              <span className="flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-full font-medium">
                <MapPin size={18} className="mr-2" />
                {job.location}
              </span>
            )}
            {job.application_deadline && (
              <span className="flex items-center text-orange-600 bg-orange-50 px-4 py-2 rounded-full font-medium">
                Deadline: {new Date(job.application_deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
            <p className="whitespace-pre-wrap mb-8">{job.full_description}</p>
            
            {job.responsibilities && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h3>
                <p className="whitespace-pre-wrap mb-8">{job.responsibilities}</p>
              </>
            )}

            {job.requirements && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <p className="whitespace-pre-wrap mb-8">{job.requirements}</p>
              </>
            )}

            {job.perks && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Perks & Benefits</h3>
                <p className="whitespace-pre-wrap mb-8">{job.perks}</p>
              </>
            )}
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-visionify-navy mb-8 border-b border-gray-100 pb-4">Submit Your Application</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Standard Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input required type="text" name="full_name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input required type="email" name="email" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input required type="tel" name="phone" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City / Location *</label>
                <input required type="text" name="city" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL (Optional)</label>
                <input type="url" name="linkedin_url" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio / Website (Optional)</label>
                <input type="url" name="portfolio_url" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join Visionify? *</label>
              <textarea required name="motivation" rows={4} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all"></textarea>
            </div>

            {/* Custom Fields */}
            {job.custom_fields && job.custom_fields.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-gray-100 mt-6">
                {job.custom_fields.map((field: any, idx: number) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && "*"}
                    </label>
                    {field.type === 'Long Text' ? (
                      <textarea
                        required={field.required}
                        name={field.label}
                        placeholder={field.placeholder}
                        onChange={handleCustomFieldChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all"
                      ></textarea>
                    ) : field.type === 'Dropdown' ? (
                      <select
                        required={field.required}
                        name={field.label}
                        onChange={handleCustomFieldChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt: string, oidx: number) => (
                          <option key={oidx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'Number' ? 'number' : field.type === 'Email' ? 'email' : 'text'}
                        required={field.required}
                        name={field.label}
                        placeholder={field.placeholder}
                        onChange={handleCustomFieldChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-visionify-cyan bg-gray-50 focus:bg-white transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Resume Upload */}
            <div className="pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume / CV (PDF max 10MB) {job.resume_required && "*"}
              </label>
              
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-visionify-cyan transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 justify-center mb-4">
                    <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-visionify-cyan hover:text-visionify-electric focus-within:outline-none">
                      <div className="flex flex-col items-center">
                        <Upload size={32} className="text-gray-400 mb-3" />
                        <span className="px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-lg">Upload a file</span>
                      </div>
                      <input id="resume-upload" name="resume-upload" type="file" accept=".pdf,application/pdf" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                  {resumeFile ? (
                    <div className="flex items-center justify-center text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full inline-flex">
                      <FileText size={16} className="mr-2" />
                      {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                {submitError}
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-gradient-to-r from-visionify-cyan to-visionify-purple hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
