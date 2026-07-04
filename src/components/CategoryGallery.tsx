"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";

type PortfolioItem = {
  id: string;
  image: string;
  title: string;
};

export default function CategoryGallery({ items, categoryTitle, accentColor }: { items: PortfolioItem[], categoryTitle: string, accentColor: string }) {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      document.body.style.overflow = 'auto'; // Restore scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = items.findIndex(i => i.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedImage(items[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = items.findIndex(i => i.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setSelectedImage(items[prevIndex]);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.length > 0 ? (
          items.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer bg-white rounded-[24px] p-4 shadow-sm hover:shadow-[0_8px_30px_rgba(34,230,213,0.15)] border border-[rgba(10,16,61,0.08)] hover:border-visionify-cyan/30 transition-all duration-300 hover:-translate-y-1 flex flex-col active:scale-95"
              onClick={() => setSelectedImage(item)}
            >
              <div className={`relative w-full aspect-[4/3] rounded-[16px] overflow-hidden ${accentColor} mb-4 flex items-center justify-center p-4`}>
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm bg-white">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Glossy hover sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full skew-x-[-20deg] transition-all duration-700 group-hover:translate-x-[200%] z-10 pointer-events-none"></div>
                {/* Search icon overlay */}
                <div className="absolute inset-0 bg-visionify-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Search className="text-visionify-navy w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <h4 className="text-lg font-bold text-visionify-navy line-clamp-1">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{categoryTitle}</p>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-[24px] border border-dashed border-gray-300 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-visionify-offwhite rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-visionify-navy mb-2">Curating Collection</h3>
            <p className="text-gray-500">Our finest designs for this category are currently being prepared.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed top-[88px] left-0 right-0 bottom-0 z-[40] flex items-center justify-center bg-[rgba(10,16,61,0.92)] backdrop-blur-md p-4 sm:p-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-[44px] h-[44px] sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-[60] backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button 
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-[44px] h-[44px] sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 rounded-full items-center justify-center text-white transition-colors z-[60] backdrop-blur-md hidden sm:flex"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-[44px] h-[44px] sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 rounded-full items-center justify-center text-white transition-colors z-[60] backdrop-blur-md hidden sm:flex"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Content Container */}
          <div 
            className="relative flex flex-col w-[92vw] max-w-5xl h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] animate-[scaleIn_0.3s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Box */}
            <div className="relative w-full flex-1 overflow-hidden">
              <Image 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1024px"
                quality={100}
                priority
              />
            </div>
            
            {/* Text & Mobile Nav Box */}
            <div className="mt-4 sm:mt-6 shrink-0 flex flex-col items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">{selectedImage.title}</h3>
              <p className="text-white/70 text-sm text-center mb-4 sm:mb-0">{categoryTitle}</p>
              
              {/* Mobile Navigation Arrows */}
              {items.length > 1 && (
                <div className="flex sm:hidden justify-center gap-6 mt-2">
                  <button 
                    className="w-[44px] h-[44px] bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-[60] backdrop-blur-md"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    className="w-[44px] h-[44px] bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-[60] backdrop-blur-md"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for modal */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </>
  );
}
