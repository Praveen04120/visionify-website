"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function AddPortfolioItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, category: data[0].slug }));
          }
        } else {
          console.error("Failed to load categories:", data);
        }
      })
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Upload file
      const uploadData = new FormData();
      uploadData.append("file", file);
      
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData
      });
      
      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadResult.error || "Upload failed");

      // 2. Save database record
      const recordRes = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: uploadResult.url
        })
      });

      const recordResult = await recordRes.json();
      if (!recordRes.ok) throw new Error(recordResult.error || "Failed to save item");

      setSuccess(true);
      // Reset form
      setFile(null);
      setPreviewUrl("");
      setFormData({
        title: "",
        category: categories.length > 0 ? categories[0].slug : "",
        description: "",
        display_order: 0,
        is_active: true
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-visionify-navy mb-8">Add Portfolio Item</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 font-medium">
            <CheckCircle2 size={20} />
            Portfolio item uploaded successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col - Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-visionify-navy">Upload Image <span className="text-visionify-pink">*</span></label>
              
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${previewUrl ? 'border-visionify-cyan bg-cyan-50/30' : 'border-gray-300 bg-gray-50 group-hover:border-visionify-cyan group-hover:bg-cyan-50/10'}`}>
                  {previewUrl ? (
                    <div className="relative w-full h-full p-2">
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                        <Image src={previewUrl} alt="Preview" fill className="object-contain bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-visionify-cyan transition-colors" />
                      <p className="text-sm font-medium text-gray-600">Click or drag image to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col - Details */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-visionify-navy mb-2">Title <span className="text-visionify-pink">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-visionify-cyan/20 focus:border-visionify-cyan outline-none transition-all"
                  placeholder="E.g., Neon Nights Poster"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-visionify-navy mb-2">Category <span className="text-visionify-pink">*</span></label>
                <select 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-visionify-cyan/20 focus:border-visionify-cyan outline-none transition-all"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-visionify-navy mb-2">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.display_order}
                    onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-visionify-cyan/20 focus:border-visionify-cyan outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-visionify-navy mb-2">Status</label>
                  <select 
                    value={formData.is_active ? "1" : "0"}
                    onChange={e => setFormData({...formData, is_active: e.target.value === "1"})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-visionify-cyan/20 focus:border-visionify-cyan outline-none transition-all"
                  >
                    <option value="1">Active</option>
                    <option value="0">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-visionify-navy mb-2">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-visionify-cyan/20 focus:border-visionify-cyan outline-none transition-all resize-none"
                  placeholder="Add details about this project..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Uploading & Saving..." : "Save Portfolio Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
