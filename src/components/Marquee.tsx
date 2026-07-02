export default function Marquee() {
  const words = [
    "Event Banners", "Branding", "Logos", "Invitations", "Promotions", "Creativity"
  ];

  return (
    <div className="w-full border-y border-visionify-pink/20 py-6 overflow-hidden relative">
      {/* Gradient edges for smooth fade */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-visionify-blush to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-visionify-blush to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max whitespace-nowrap animate-[marquee_8s_linear_infinite] md:animate-[marquee_13s_linear_infinite]">
        {/* Double the array for seamless loop */}
        {[...words, ...words, ...words].map((word, idx) => (
          <div key={idx} className="flex items-center mx-8">
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00B8D9] via-[#2563EB] to-[#6D28D9] uppercase tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
              {word}
            </span>
            <span className="mx-8 text-white/50 text-2xl">•</span>
          </div>
        ))}
      </div>
      
      {/* Inline style for keyframes if tailwind arbitrary values aren't enough */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </div>
  );
}
