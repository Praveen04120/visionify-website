import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryGallery from "@/components/CategoryGallery";
import { supabase } from "@/lib/supabase";

// Colors array for fallback accent colors
const fallbackColors = [
  "bg-visionify-cyan",
  "bg-visionify-purple",
  "bg-visionify-electric",
  "bg-visionify-pink",
];

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from("portfolio_categories")
    .select("slug")
    .eq("is_active", true)
    .neq("slug", "_collaborators_");

  if (!categories) return [];

  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  
  const { data: category } = await supabase
    .from("portfolio_categories")
    .select("name, description")
    .eq("slug", resolvedParams.category)
    .single();

  if (!category) return { title: "Not Found | Visionify India" };
  
  const title = `Visionify India | ${category.name} Portfolio`;
  const description = category.description || `Explore our premium ${category.name} portfolio by Visionify India. View our creative designs that make your brand stand out.`;
  
  return { 
    title, 
    description,
    alternates: {
      canonical: `/work/${resolvedParams.category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://visionify.co.in/work/${resolvedParams.category}`,
    }
  };
}

// Ensure the route is dynamically rendered or revalidated as needed
// Next.js will cache fetches, so we set revalidate to allow fresh data to appear
export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  const { data: meta } = await supabase
    .from("portfolio_categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!meta) {
    notFound();
  }

  // Derive an accent color based on display order or fallback
  const accentColor = fallbackColors[(meta.display_order || 0) % fallbackColors.length];

  // Fetch dynamic items from Supabase
  const { data: items, error } = await supabase
    .from("portfolio_items")
    .select("id, title, image_url")
    .eq("category", categorySlug)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Map supabase items to the format expected by CategoryGallery
  const mappedItems = items ? items.map(item => ({
    id: item.id,
    title: item.title,
    image: item.image_url
  })) : [];

  return (
    <div className="relative overflow-hidden selection:bg-visionify-cyan selection:text-white">
      {/* Category Header */}
      <section className="pt-32 pb-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 animate-[fadeInUp_1s_ease-out]">
        <div className="mb-8">
          <Link href="/work" className="inline-flex items-center text-sm font-semibold text-visionify-navy/70 hover:text-visionify-purple transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Work
          </Link>
          <span className="text-sm font-bold tracking-widest text-visionify-cyan uppercase mb-4 block">Portfolio Collection</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-visionify-navy mb-6">
            {meta.name}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-2xl font-medium leading-relaxed">
            {meta.description || `Explore our latest creations in the ${meta.name} portfolio.`}
          </p>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="pb-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <CategoryGallery items={mappedItems} categoryTitle={meta.name} accentColor={accentColor} />
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10 border-t border-visionify-pink/20">
        <h2 className="text-3xl md:text-4xl font-bold text-visionify-navy mb-4">Like What You See?</h2>
        <p className="text-gray-700 text-lg mb-8 max-w-xl mx-auto">
          Let’s create something designed specifically for your brand, event, or celebration.
        </p>
        <Link href="/get-a-quote" className="min-h-[48px] inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple shadow-md active:scale-95 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          Start a Project
        </Link>
      </section>
    </div>
  );
}
