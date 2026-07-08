"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, PlusCircle, MessageSquare, LogOut, Mailbox, Menu, X, Briefcase } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Portfolio", href: "/admin/manage", icon: <ImageIcon size={20} /> },
    { name: "Add New Item", href: "/admin/add", icon: <PlusCircle size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <LayoutDashboard size={20} /> },
    { name: "Job Openings", href: "/admin/jobs", icon: <Briefcase size={20} /> },
    { name: "Contact Messages", href: "/admin/contact-messages", icon: <Mailbox size={20} /> },
    { name: "Community Apps", href: "/admin/community-applications", icon: <MessageSquare size={20} /> },
    { name: "Collaborators", href: "/admin/collaborators", icon: <ImageIcon size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0 h-20">
        <h2 className="text-xl font-bold text-visionify-navy tracking-tight truncate">Visionify Admin</h2>
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors min-h-[48px] ${
                isActive 
                  ? "bg-visionify-cyan/10 text-visionify-cyan" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-visionify-navy"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors min-h-[48px]"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden text-visionify-navy">
      
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 fixed left-0 top-0 h-full z-10 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-visionify-navy/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-72 max-w-[80vw] bg-white flex flex-col h-full shadow-2xl animate-[slideInLeft_0.3s_ease-out]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:ml-64 w-full h-full relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-5 h-16 bg-white border-b border-gray-200 shrink-0 shadow-sm z-10">
          <h2 className="text-lg font-bold text-visionify-navy tracking-tight truncate">Visionify Admin</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-600 active:bg-gray-100 rounded-lg min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
