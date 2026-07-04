"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit2, Trash2, CheckCircle, XCircle, Plus, Link as LinkIcon, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ManageCollaborators() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    display_order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/collaborators");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (file) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload image");
        
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        throw new Error("Logo image is required");
      }

      const url = editingId ? `/api/admin/collaborators/${editingId}` : "/api/admin/collaborators";
      const method = editingId ? "PUT" : "POST";
      
      const payload = { ...formData, image_url: finalImageUrl };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to save collaborator");

      if (editingId) {
        setItems(items.map(i => i.id === editingId ? data : i));
      } else {
        setItems([...items, data]);
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFile(null);
      setFormData({ title: "", image_url: "", description: "", display_order: 0, is_active: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setIsAdding(true);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm("Are you sure? This will delete the collaborator and their logo.")) return;
    try {
      // API handles DB and storage deletion
      const res = await fetch(`/api/admin/collaborators/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete from DB");
      
      setItems(items.filter(i => i.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-visionify-navy">Manage Collaborators</h1>
          <p className="text-gray-500 mt-1">Add partner logos that appear on the collaborations page.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFile(null); setFormData({ title: "", image_url: "", description: "", display_order: 0, is_active: true }); }}
            className="flex items-center gap-2 px-4 py-2 bg-visionify-cyan text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors"
          >
            <Plus size={20} /> Add Partner
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Partner" : "New Partner"}</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Partner Name <span className="text-visionify-pink">*</span></label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Website Link (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                    placeholder="https://"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Upload Logo <span className="text-visionify-pink">*</span></label>
                {formData.image_url && !file && (
                  <div className="mb-2 relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2">
                     <Image src={formData.image_url} alt="Logo" fill className="object-contain" />
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 font-medium">
                        {file ? file.name : "Click to upload SVG, PNG, or JPG"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required={!formData.image_url} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Display Order</label>
                <input 
                  type="number" 
                  value={formData.display_order} 
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select 
                  value={formData.is_active ? "1" : "0"} 
                  onChange={e => setFormData({ ...formData, is_active: e.target.value === "1" })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none bg-white"
                >
                  <option value="1">Active</option>
                  <option value="0">Hidden</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setIsAdding(false)} disabled={uploading} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={uploading} className="px-5 py-2 bg-visionify-cyan text-white rounded-lg hover:bg-cyan-500 font-medium disabled:opacity-50">
                {uploading ? "Saving..." : "Save Partner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
            <div className="relative w-16 h-16 border rounded-full overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center p-2">
              <Image src={item.image_url} alt={item.title} fill className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-visionify-navy text-lg flex items-center gap-2 truncate">
                {item.title}
                {!item.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
              </h3>
              {item.description && (
                <a href={item.description} target="_blank" rel="noopener noreferrer" className="text-sm text-visionify-cyan hover:underline flex items-center gap-1 truncate">
                  <LinkIcon size={12} /> {item.description}
                </a>
              )}
              <p className="text-xs text-gray-500 mt-1">Order: {item.display_order}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(item.id, item.image_url)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !isAdding && (
          <div className="p-8 text-center text-gray-500">No collaborators found.</div>
        )}
      </div>
    </div>
  );
}
