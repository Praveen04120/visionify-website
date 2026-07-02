import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Collaborations | Visionify",
  description: "Visionify is the Official Designing Partner of TechTattva Community.",
};

export default function CollaborationsPage() {
  return (
    <div className="relative overflow-hidden selection:bg-visionify-cyan selection:text-white pb-24">
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

      {/* TechTattva Feature Section */}
      <section className="px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgba(10,16,61,0.08)] animate-[fadeInUp_1.2s_ease-out]">
          
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Logo Display */}
            <div className="w-full md:w-2/5 flex justify-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full p-2 bg-gradient-to-tr from-visionify-cyan via-visionify-electric to-visionify-purple shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-white animate-pulse opacity-20"></div>
                <div className="w-full h-full bg-[#030B1E] rounded-full flex items-center justify-center p-6 relative overflow-hidden">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-purple-500/20"></div>
                  <Image 
                    src="/techtattva-logo.png" 
                    alt="TechTattva Community Logo" 
                    width={200} 
                    height={200}
                    className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,230,213,0.5)]"
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
                VISIONIFY × TechTattva
              </h2>
              
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8">
                Visionify is the <strong className="text-visionify-electric">Official Designing Partner</strong> of TechTattva Community.
              </p>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-600 mb-0">
                  Bringing visionary aesthetics to one of the most vibrant tech communities. Together, we elevate the visual experience of innovation and technology.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
