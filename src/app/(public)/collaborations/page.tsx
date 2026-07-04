import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export const metadata = {
  title: "Collaborations | Visionify",
  description: "Visionify Official Partnerships",
};

export default async function CollaborationsPage() {
  const { data: partners } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("category", "_collaborators_")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="relative overflow-hidden selection:bg-visionify-cyan selection:text-white pb-24 min-h-screen">
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[400px] bg-cyan-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[400px] bg-purple-200/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header */}
      <section className="pt-32 pb-16 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 animate-[fadeInUp_1s_ease-out]">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-visionify-navy/70 hover:text-visionify-purple transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <span className="text-sm font-bold tracking-widest text-visionify-cyan uppercase mb-4 block">Official Partnerships</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-visionify-navy mb-6">
            Collaborations
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-visionify-cyan via-visionify-electric to-visionify-purple mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-2xl font-medium leading-relaxed">
            Partnering with innovative brands and communities to deliver exceptional design experiences.
          </p>
        </div>
      </section>

      {/* Dynamic Partners Section */}
      <section className="px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="space-y-12">
          {(!partners || partners.length === 0) ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-visionify-navy">More collaborations coming soon!</h3>
            </div>
          ) : (
            partners.map((partner, index) => (
              <div key={partner.id} className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgba(10,16,61,0.08)] animate-[fadeInUp_1.2s_ease-out] hover:shadow-[0_12px_50px_rgba(10,16,61,0.12)] transition-shadow">
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}>
                  
                  {/* Logo Display */}
                  <div className="w-full md:w-2/5 flex justify-center">
                    <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full p-1 bg-gradient-to-tr from-visionify-cyan via-visionify-electric to-visionify-purple shadow-xl">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-8 relative overflow-hidden">
                        <Image 
                          src={partner.image_url} 
                          alt={`${partner.title} Logo`}
                          fill
                          className="object-contain p-8 relative z-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-3/5 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-visionify-pink/10 text-visionify-purple text-sm font-bold tracking-wide mb-6">
                      <ShieldCheck size={16} />
                      OFFICIAL PARTNER
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-visionify-navy mb-4">
                      VISIONIFY × {partner.title}
                    </h2>
                    
                    <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8">
                      Visionify is the <strong className="text-visionify-electric">Official Designing Partner</strong> of {partner.title}.
                    </p>

                    {partner.description && (
                      <div className="mt-4">
                        <a href={partner.description.startsWith('http') ? partner.description : `https://${partner.description}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-visionify-navy hover:bg-visionify-electric transition-colors">
                          <LinkIcon size={18} /> Visit Partner
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
