import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Palette, Layers, Sparkles } from "lucide-react";
import Marquee from "@/components/Marquee";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function Home() {
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
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-pink-200/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-purple-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="pt-28 pb-16 lg:pt-32 lg:pb-20 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          {/* Text Content */}
          <div className="order-1 text-left z-10 animate-[fadeInUp_1s_ease-out]">
            <h1 className="text-[40px] leading-[1.1] sm:text-5xl lg:text-7xl font-bold tracking-tight text-visionify-navy mb-5 lg:mb-6">
              Where Ideas <br className="block sm:hidden" />
              Become <br className="hidden sm:block lg:block" />
              <span className="text-gradient">Visual Stories.</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 lg:mb-10 max-w-xl font-medium leading-relaxed">
              Creative designs that make brands, events, and celebrations impossible to ignore. We bring your vision to life with vibrant colors and premium aesthetics.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
              <Link href="/work" className="min-h-[48px] px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-[0_8px_20px_rgba(110,30,219,0.25)] hover:shadow-[0_8px_25px_rgba(34,230,213,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 group text-center flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10">Explore Our Work</span>
                <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                {/* Glossy hover sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full skew-x-[-20deg] transition-all duration-700 group-hover:translate-x-[200%] z-0 pointer-events-none"></div>
              </Link>
              <Link href="/contact" className="min-h-[48px] px-8 py-3.5 rounded-full font-semibold text-visionify-navy bg-white/90 backdrop-blur-sm border border-white hover:border-visionify-cyan shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="order-2 flex justify-center lg:justify-end z-10 relative mt-4 lg:mt-0 opacity-0 animate-[fadeSlideUp_1.2s_ease-out_0.3s_forwards]">
            <div className="relative w-full max-w-[500px] aspect-square rounded-[24px] lg:rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-md shadow-2xl p-4 lg:p-6 border border-white/60 animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 rounded-[24px] lg:rounded-[32px] border-2 border-transparent bg-clip-border shadow-[0_0_30px_rgba(34,230,213,0.15)]" style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #22E6D5, #6E1EDB) border-box' }}></div>
              <div className="relative w-full h-full rounded-[16px] lg:rounded-[24px] overflow-hidden shadow-inner bg-white">
                <Image 
                  src="/hero-abstract.png" 
                  alt="Visionify Abstract Creative Design" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <Marquee />

      {/* Feature Preview Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Palette size={32} className="text-visionify-cyan" />, title: "Bold Visual Identity", desc: "Crafting memorable brands that stand out in crowded markets.", bg: "bg-cyan-50" },
            { icon: <Sparkles size={32} className="text-visionify-purple" />, title: "Scroll-Stopping Creatives", desc: "Engaging social media designs and digital promotions.", bg: "bg-purple-50" },
            { icon: <Layers size={32} className="text-visionify-pink" />, title: "Designs Made to Be Remembered", desc: "Premium print materials from elegant wedding cards to striking posters.", bg: "bg-pink-50" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 hover-glossy group shadow-md border border-gray-100 hover:shadow-xl hover:border-visionify-cyan/20 transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-visionify-navy mb-3">{feature.title}</h3>
              <p className="text-gray-500 font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Work Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple uppercase mb-3">Portfolio Showcase</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-visionify-navy mb-6">Our Creative Universe</h3>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">Every design is created to capture attention, communicate clearly, and leave a lasting impression.</p>
        </div>

        {categories.length > 0 ? (
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
                    <h4 className="text-xl font-bold text-visionify-navy mb-2">{category.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.desc}</p>
                  </div>
                  <p className="text-visionify-electric font-semibold flex items-center gap-2 group-hover:text-visionify-purple transition-colors duration-300">
                    View Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-visionify-navy mb-2">Curating Our Best Work</h3>
            <p className="text-gray-500 font-medium">A selection of our finest designs is currently being prepared for this showcase.</p>
          </div>
        )}
      </section>

      {/* Animations now in globals.css */}
    </div>
  );
}
