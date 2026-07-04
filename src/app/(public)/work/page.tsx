import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Our Work | Visionify",
  description: "Explore the premium portfolio of Visionify, including logos, branding, posters, and invitations.",
};

export const revalidate = 60;

export default async function WorkPage() {
  // Fetch dynamic categories
  const { data: dbCategories } = await supabase
    .from("portfolio_categories")
    .select("*")
    .eq("is_active", true)
    .neq("slug", "_collaborators_")
    .order("display_order", { ascending: true });

  // Fetch the latest active image for each category to use as the fallback preview
  const { data: latestItems } = await supabase
    .from("portfolio_items")
    .select("category, image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const bgColors = [
    "bg-purple-50",
    "bg-cyan-50",
    "bg-indigo-50",
    "bg-orange-50",
    "bg-pink-50",
    "bg-blue-50"
  ];

  // Map latest image to category if no cover is set
  const categories = (dbCategories || []).map((cat, idx) => {
    const latestItem = latestItems?.find(item => item.category === cat.slug);
    return {
      id: cat.slug,
      title: cat.name,
      desc: cat.description || "Explore our premium creations in this category.",
      bg: bgColors[idx % bgColors.length],
      // Fallback logic
      image: cat.cover_image_url || latestItem?.image_url || null
    };
  });

  return (
    <div className="relative overflow-hidden selection:bg-visionify-cyan selection:text-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[400px] bg-cyan-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[400px] bg-purple-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10 animate-[fadeInUp_1s_ease-out]">
        <span className="text-sm font-bold tracking-widest text-visionify-purple uppercase mb-4 block">Our Work</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-visionify-navy mb-6 max-w-4xl mx-auto leading-tight">
          Designs That Make <br className="hidden sm:block" />
          <span className="text-gradient">An Impression.</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          From bold event creatives to elegant invitations and memorable brand identities, every Visionify design is created to stand out.
        </p>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <a href="#categories" className="min-h-[48px] px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center">
            Explore Categories
          </a>
          <Link href="/contact" className="min-h-[48px] px-8 py-3.5 rounded-full font-semibold text-visionify-navy bg-white/90 backdrop-blur-sm border border-white hover:border-visionify-cyan shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="categories" className="py-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              href={`/work/${category.id}`} 
              key={category.id} 
              className="group bg-white rounded-[24px] p-4 shadow-sm hover:shadow-[0_8px_30px_rgba(34,230,213,0.15)] border border-[rgba(10,16,61,0.08)] hover:border-visionify-cyan/30 transition-all duration-300 hover:-translate-y-1 flex flex-col active:scale-95"
            >
              {/* Image Container with Padding and Pastel Background */}
              <div className={`relative w-full aspect-[4/3] rounded-[16px] overflow-hidden ${category.bg} mb-6 flex items-center justify-center p-4`}>
                {category.image ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm">
                    <Image 
                      src={category.image} 
                      alt={category.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-gray-200/60 rounded-lg flex flex-col items-center justify-center text-gray-500 font-medium bg-white/40">
                    <span className="text-xl mb-1">✧</span>
                    <span className="text-sm">Curating Collection</span>
                  </div>
                )}
                {/* Glossy Flash Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full skew-x-[-20deg] transition-all duration-700 group-hover:translate-x-[200%] z-10 pointer-events-none"></div>
              </div>
              
              {/* Content Below Image */}
              <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-visionify-navy mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.desc}</p>
                </div>
                <p className="text-visionify-electric font-semibold flex items-center gap-2 group-hover:text-visionify-purple transition-colors duration-300">
                  View Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[32px] p-10 md:p-16 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-visionify-navy mb-4">Have a Vision in Mind?</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-xl mx-auto">
            Tell us what you need, and we’ll turn your idea into a design that stands out.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Link href="/contact" className="min-h-[48px] px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md active:scale-95 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center">
              Contact Visionify
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
