import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryGallery from "@/components/CategoryGallery";
import { supabase } from "@/lib/supabase";

const categoryMap: Record<string, { title: string, description: string, accentColor: string }> = {
  "event-banners": {
    title: "Event Banners",
    description: "Striking banners designed to set the tone for your events.",
    accentColor: "bg-visionify-cyan",
  },
  "brand-promotions": {
    title: "Brand Promotions",
    description: "Scroll-stopping social media creatives and digital ad designs.",
    accentColor: "bg-visionify-purple",
  },
  "logos": {
    title: "Logos & Identity",
    description: "Memorable logos and complete brand identity packages.",
    accentColor: "bg-visionify-electric",
  },
  "business-cards": {
    title: "Business Cards",
    description: "Premium business card designs that leave a lasting impression.",
    accentColor: "bg-visionify-cyan",
  },
  "wedding-cards": {
    title: "Wedding Cards",
    description: "Elegant, bespoke invitation designs for your special day.",
    accentColor: "bg-visionify-pink",
  },
  "private-party-posters": {
    title: "Private Party Posters",
    description: "Vibrant and exclusive poster designs for private events.",
    accentColor: "bg-visionify-purple",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryMap).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const meta = categoryMap[resolvedParams.category];
  if (!meta) return { title: "Not Found | Visionify" };
  return { title: `${meta.title} | Our Work | Visionify`, description: meta.description };
}

// Ensure the route is dynamically rendered or revalidated as needed
// Next.js will cache fetches, so we set revalidate to allow fresh data to appear
export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const meta = categoryMap[category];

  if (!meta) {
    notFound();
  }

  // Fetch dynamic items from Supabase
  const { data: items, error } = await supabase
    .from("portfolio_items")
    .select("id, title, image_url")
    .eq("category", category)
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
            {meta.title}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-2xl font-medium leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="pb-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <CategoryGallery items={mappedItems} categoryTitle={meta.title} accentColor={meta.accentColor} />
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
