"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, Plus, Edit2 } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
    is_active: true
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSlugGen = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.slug) {
      setError("Name and slug are required");
      return;
    }

    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
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
      setFormData({ name: "", slug: "", description: "", display_order: 0, is_active: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData(cat);
    setIsAdding(true);
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
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", slug: "", description: "", display_order: 0, is_active: true }); }}
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
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
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
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-visionify-cyan text-white rounded-lg hover:bg-cyan-500 font-medium">Save Category</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {categories.map(cat => (
          <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
            <div>
              <h3 className="font-bold text-visionify-navy text-lg flex items-center gap-2">
                {cat.name}
                {!cat.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
              </h3>
              <p className="text-sm text-gray-500">/{cat.slug} • Order: {cat.display_order}</p>
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
