"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Work", href: "/work" },
    { name: "Collaborations", href: "/collaborations" },
    { name: "Pricing / Get a Quote", href: "/get-a-quote" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/work") {
      return pathname.startsWith("/work");
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white shadow-md group-hover:border-visionify-cyan transition-colors">
              <Image 
                src="/logo.jpeg" 
                alt="Visionify Logo" 
                fill 
                sizes="(max-width: 48px) 100vw, 48px"
                className="object-cover"
              />
            </div>
            <span className="font-bold text-2xl tracking-wider text-visionify-navy hidden sm:block">VISIONIFY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-all duration-300 group ${
                    active ? "text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple" : "text-visionify-navy hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-visionify-cyan hover:to-visionify-purple"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-visionify-cyan to-visionify-purple transition-all duration-300 rounded-full ${active ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              );
            })}
            <Link
              href="/get-a-quote"
              className="px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple hover:shadow-[0_0_20px_rgba(34,230,213,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-visionify-navy focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
          isMobileMenuOpen ? "scale-y-100 opacity-100 max-h-[500px]" : "scale-y-0 opacity-0 max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center min-h-[48px] px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
                  active ? "bg-visionify-blush/30 text-visionify-purple" : "text-visionify-navy hover:bg-visionify-blush/20 hover:text-visionify-purple active:bg-visionify-blush/40"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/get-a-quote"
              className="flex items-center justify-center min-h-[48px] px-6 py-2 rounded-full font-semibold text-base text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md active:scale-95 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
