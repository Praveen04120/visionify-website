"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Trash2, Plus, Edit2, Upload } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // To allow selecting existing items from this category as cover
  const [categoryItems, setCategoryItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
    is_active: true,
    cover_image_url: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryItems = async (slug: string) => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const data = await res.json();
        setCategoryItems(Array.isArray(data) ? data.filter((d: any) => d.category === slug) : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSlugGen = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    
    if (!formData.name || !formData.slug) {
      setError("Name and slug are required");
      setUploading(false);
      return;
    }

    try {
      let finalImageUrl = formData.cover_image_url;

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

      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cover_image_url: finalImageUrl })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      if (editingId) {
        setCategories(categories.map(c => c.id === editingId ? data : c));
      } else {
        setCategories([...categories, data]);
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFile(null);
      setCategoryItems([]);
      setFormData({ name: "", slug: "", description: "", display_order: 0, is_active: true, cover_image_url: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      display_order: cat.display_order || 0,
      is_active: cat.is_active ?? true,
      cover_image_url: cat.cover_image_url || ""
    });
    setIsAdding(true);
    setFile(null);
    if (cat.slug) fetchCategoryItems(cat.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This cannot be undone. You can only delete categories with NO portfolio items.")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to delete category");
        return;
      }
      
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      alert("An error occurred");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-visionify-navy">Manage Categories</h1>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFile(null); setFormData({ name: "", slug: "", description: "", display_order: 0, is_active: true, cover_image_url: "" }); setCategoryItems([]); }}
            className="flex items-center gap-2 px-4 py-2 bg-visionify-cyan text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors"
          >
            <Plus size={20} /> Add Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Category" : "New Category"}</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value, slug: editingId ? formData.slug : handleSlugGen(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Slug</label>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={e => {
                    const newSlug = e.target.value;
                    setFormData({ ...formData, slug: newSlug });
                    if (newSlug) fetchCategoryItems(newSlug);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  value={formData.description || ""} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" 
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
                <label className="block text-sm font-semibold">Category Cover Image</label>
                {formData.cover_image_url && !file && (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                    <Image src={formData.cover_image_url} alt="Cover" fill className="object-cover" />
                  </div>
                )}
                
                {categoryItems.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-2">Or select from existing items in this category:</p>
                    <select
                      value={formData.cover_image_url}
                      onChange={e => {
                        setFormData({...formData, cover_image_url: e.target.value});
                        setFile(null); // Clear custom upload if they select existing
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none bg-white text-sm"
                    >
                      <option value="">-- Choose an item --</option>
                      {categoryItems.map(item => (
                        <option key={item.id} value={item.image_url}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">Upload a custom cover image:</p>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500 font-medium">
                        {file ? file.name : "Click to upload a custom cover image"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
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
                {uploading ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {categories.map(cat => (
          <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
            <div className="flex items-center gap-4">
              {cat.cover_image_url ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                  <Image src={cat.cover_image_url} alt={cat.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-xs">No Cover</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-visionify-navy text-lg flex items-center gap-2">
                  {cat.name}
                  {!cat.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                </h3>
                <p className="text-sm text-gray-500">/{cat.slug} • Order: {cat.display_order}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && !isAdding && (
          <div className="p-8 text-center text-gray-500">No categories found.</div>
        )}
      </div>
    </div>
  );
}
