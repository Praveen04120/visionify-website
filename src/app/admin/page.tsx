"use client";

import { useState, useEffect } from "react";
import { Layers, Image as ImageIcon, MessageSquare, AlertCircle, Mailbox } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    newQuotes: 0,
    newContacts: 0,
    categories: [] as { name: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, quotesRes, contactsRes] = await Promise.all([
          fetch("/api/admin/portfolio"),
          fetch("/api/admin/quotes"),
          fetch("/api/admin/contact-messages")
        ]);

        if (portfolioRes.ok && quotesRes.ok && contactsRes.ok) {
          const portfolio = await portfolioRes.json();
          const quotes = await quotesRes.json();
          const contacts = await contactsRes.json();

          const activeCount = portfolio.filter((i: any) => i.is_active).length;
          const newQuotesCount = quotes.filter((q: any) => q.status === 'new').length;
          const newContactsCount = contacts.filter((c: any) => c.status === 'new').length;

          // Category counts
          const counts: Record<string, number> = {};
          portfolio.forEach((item: any) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
          });
          const categoryArray = Object.keys(counts).map(k => ({ name: k, count: counts[k] }));

          setStats({
            totalItems: portfolio.length,
            activeItems: activeCount,
            newQuotes: newQuotesCount,
            newContacts: newContactsCount,
            categories: categoryArray,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-visionify-navy mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-visionify-cyan">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Items</p>
            <p className="text-2xl font-bold text-visionify-navy">{stats.totalItems}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-visionify-purple">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Items</p>
            <p className="text-2xl font-bold text-visionify-navy">{stats.activeItems}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-visionify-pink">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">New Quotes</p>
            <p className="text-2xl font-bold text-visionify-navy">{stats.newQuotes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Mailbox size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">New Messages</p>
            <p className="text-2xl font-bold text-visionify-navy">{stats.newContacts}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-visionify-navy mb-4">Items by Category</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {stats.categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
            <p>No portfolio items found.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">Category</th>
                <th className="px-6 py-4 border-b border-gray-100 w-32 text-right">Items Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.categories.map(c => (
                <tr key={c.name} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-visionify-navy font-medium">{c.name.replace(/-/g, ' ').toUpperCase()}</td>
                  <td className="px-6 py-4 text-right font-bold text-visionify-cyan">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
