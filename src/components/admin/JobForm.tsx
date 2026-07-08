"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface JobFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function JobForm({ initialData, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    job_type: initialData?.job_type || "Full-time",
    location: initialData?.location || "",
    department: initialData?.department || "",
    short_description: initialData?.short_description || "",
    full_description: initialData?.full_description || "",
    responsibilities: initialData?.responsibilities || "",
    requirements: initialData?.requirements || "",
    perks: initialData?.perks || "",
    openings_count: initialData?.openings_count || "",
    application_deadline: initialData?.application_deadline || "",
    status: initialData?.status || "Draft",
    accepts_applications: initialData?.accepts_applications ?? true,
    resume_required: initialData?.resume_required ?? false,
    custom_fields: initialData?.custom_fields || []
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!isEditing) {
      setFormData({ ...formData, title, slug: generateSlug(title) });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleAddCustomField = () => {
    setFormData({
      ...formData,
      custom_fields: [
        ...formData.custom_fields,
        { label: "", type: "Short Text", required: false, placeholder: "", options: [] }
      ]
    });
  };

  const handleCustomFieldChange = (index: number, key: string, value: any) => {
    const newFields = [...formData.custom_fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormData({ ...formData, custom_fields: newFields });
  };

  const handleCustomFieldOptionsChange = (index: number, value: string) => {
    const options = value.split(',').map(s => s.trim()).filter(Boolean);
    handleCustomFieldChange(index, "options", options);
  };

  const removeCustomField = (index: number) => {
    const newFields = formData.custom_fields.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, custom_fields: newFields });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/admin/jobs/${initialData.id}` : "/api/admin/jobs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save job");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs" className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-visionify-navy">
          {isEditing ? "Edit Job Opening" : "Add Job Opening"}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position Name *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location / Work Mode</label>
              <input type="text" name="location" placeholder="e.g. Remote, Delhi, Hybrid" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
              <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan">
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Openings</label>
              <input type="number" name="openings_count" value={formData.openings_count} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Job Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description (Preview) *</label>
              <textarea required name="short_description" rows={2} value={formData.short_description} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Job Description *</label>
              <textarea required name="full_description" rows={5} value={formData.full_description} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Responsibilities</label>
              <textarea name="responsibilities" rows={4} value={formData.responsibilities} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements / Eligibility</label>
              <textarea name="requirements" rows={4} value={formData.requirements} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Perks / Benefits *</label>
              <textarea required name="perks" rows={3} value={formData.perks} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-visionify-cyan"></textarea>
            </div>
          </div>
        </div>

        {/* Application Settings & Custom Fields */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Application Settings & Custom Fields</h2>
            <button type="button" onClick={handleAddCustomField} className="inline-flex items-center text-sm font-semibold text-visionify-cyan hover:text-visionify-navy transition-colors">
              <PlusCircle size={16} className="mr-1" /> Add Custom Field
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="accepts_applications" checked={formData.accepts_applications} onChange={handleChange} className="w-5 h-5 text-visionify-cyan rounded focus:ring-visionify-cyan" />
              <span className="text-gray-700 font-medium">Accept Applications</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="resume_required" checked={formData.resume_required} onChange={handleChange} className="w-5 h-5 text-visionify-cyan rounded focus:ring-visionify-cyan" />
              <span className="text-gray-700 font-medium">Resume Required</span>
            </label>
          </div>

          <div className="space-y-6">
            {formData.custom_fields.map((field: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                <button type="button" onClick={() => removeCustomField(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Field Label *</label>
                    <input required type="text" value={field.label} onChange={(e) => handleCustomFieldChange(index, "label", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Field Type</label>
                    <select value={field.type} onChange={(e) => handleCustomFieldChange(index, "type", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-visionify-cyan">
                      <option value="Short Text">Short Text</option>
                      <option value="Long Text">Long Text</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Number">Number</option>
                      <option value="Dropdown">Dropdown</option>
                      <option value="Checkbox">Checkbox</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Placeholder</label>
                    <input type="text" value={field.placeholder} onChange={(e) => handleCustomFieldChange(index, "placeholder", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
                  </div>
                  {field.type === 'Dropdown' && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Options (comma separated)</label>
                      <input type="text" value={(field.options || []).join(', ')} onChange={(e) => handleCustomFieldOptionsChange(index, e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-visionify-cyan" />
                    </div>
                  )}
                  <div className="md:col-span-2 pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={field.required} onChange={(e) => handleCustomFieldChange(index, "required", e.target.checked)} className="w-4 h-4 text-visionify-cyan rounded focus:ring-visionify-cyan" />
                      <span className="text-sm font-medium text-gray-700">Required Field</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
            {formData.custom_fields.length === 0 && (
              <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                No custom fields added. The default fields (Name, Email, Phone, City, Motivation) will always be present.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-visionify-navy text-white font-bold rounded-xl shadow-md hover:bg-visionify-cyan transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? <span className="animate-pulse">Saving...</span> : "Save Job Opening"}
          </button>
        </div>

      </form>
    </div>
  );
}
