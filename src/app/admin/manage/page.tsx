"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ManagePortfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([
        fetch("/api/admin/portfolio"),
        fetch("/api/categories")
      ]);
      
      if (itemsRes.ok) setItems(await itemsRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item? The image will be permanently deleted from storage.")) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/portfolio/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setItems(items.map(i => i.id === editingId ? updatedItem : i));
        setEditingId(null);
      } else {
        alert("Failed to update item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = filter === "all" ? items : items.filter(i => i.category === filter);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading portfolio...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-visionify-navy">Manage Portfolio</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-visionify-cyan min-h-[48px]"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
            <p>No items found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-sm font-medium text-gray-500">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-100 w-24">Image</th>
                    <th className="px-6 py-4 border-b border-gray-100">Details</th>
                    <th className="px-6 py-4 border-b border-gray-100 w-32">Status</th>
                    <th className="px-6 py-4 border-b border-gray-100 w-24">Order</th>
                    <th className="px-6 py-4 border-b border-gray-100 w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => {
                    const categoryName = categories.find(c => c.slug === item.category)?.name || item.category;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal">
                          {editingId === item.id ? (
                            <div className="space-y-2 max-w-sm">
                              <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" />
                              <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none text-sm">
                                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                              </select>
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold text-visionify-navy">{item.title}</p>
                              <p className="text-sm text-gray-500">{categoryName}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <select value={editForm.is_active ? "1" : "0"} onChange={e => setEditForm({...editForm, is_active: e.target.value === "1"})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none text-sm">
                              <option value="1">Active</option>
                              <option value="0">Hidden</option>
                            </select>
                          ) : (
                            item.is_active 
                              ? <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle size={14}/> Active</span>
                              : <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-bold"><XCircle size={14}/> Hidden</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <input type="number" value={editForm.display_order} onChange={e => setEditForm({...editForm, display_order: parseInt(e.target.value) || 0})} className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-visionify-cyan outline-none" />
                          ) : (
                            <span className="font-medium text-gray-600">{item.display_order}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingId === item.id ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                              <button onClick={saveEdit} className="px-4 py-2 text-sm bg-visionify-cyan text-white rounded-lg hover:bg-cyan-500 font-medium transition-colors">Save</button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => startEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={20}/></button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={20}/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {filteredItems.map(item => {
                const categoryName = categories.find(c => c.slug === item.category)?.name || item.category;
                return (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col gap-4">
                    {editingId === item.id ? (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-visionify-cyan outline-none text-sm" placeholder="Title" />
                            <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-visionify-cyan outline-none text-sm bg-white">
                              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select value={editForm.is_active ? "1" : "0"} onChange={e => setEditForm({...editForm, is_active: e.target.value === "1"})} className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-visionify-cyan outline-none text-sm bg-white">
                            <option value="1">Active</option>
                            <option value="0">Hidden</option>
                          </select>
                          <input type="number" placeholder="Order" value={editForm.display_order} onChange={e => setEditForm({...editForm, display_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-visionify-cyan outline-none text-sm" />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button onClick={() => setEditingId(null)} className="flex-1 py-3 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-colors">Cancel</button>
                          <button onClick={saveEdit} className="flex-1 py-3 text-sm bg-visionify-cyan text-white rounded-xl hover:bg-cyan-500 font-bold transition-colors shadow-sm">Save Changes</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-visionify-navy text-base truncate">{item.title}</h3>
                          <p className="text-sm text-gray-500 truncate mb-2">{categoryName}</p>
                          <div className="flex items-center gap-3">
                            {item.is_active 
                              ? <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle size={14}/> Active</span>
                              : <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-bold"><XCircle size={14}/> Hidden</span>
                            }
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">Order: {item.display_order}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => startEdit(item)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Edit">
                            <Edit2 size={18}/>
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Delete">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
