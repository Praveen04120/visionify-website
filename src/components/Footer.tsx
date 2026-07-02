import Link from "next/link";
import Image from "next/image";
import { Camera, Mail, Phone } from "lucide-react";
import ContactForm from "./ContactForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative mt-20 pt-16 pb-8 border-t border-visionify-pink/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-visionify-cyan via-visionify-electric via-visionify-purple to-visionify-pink"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Form Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-visionify-navy tracking-tight mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              Have a project in mind or just want to say hi? Drop us a message below and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gray-200 group-hover:border-visionify-cyan transition-colors">
                <Image 
                  src="/logo.jpeg" 
                  alt="Visionify Logo" 
                  fill 
                  sizes="(max-width: 48px) 100vw, 48px"
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-2xl tracking-wider text-visionify-navy">VISIONIFY</span>
            </Link>
            <p className="text-xl font-light text-visionify-navy mb-6 max-w-md">
              Designing Ideas, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple font-bold">Elevating Brands.</span>
            </p>
            <p className="text-sm text-gray-500 max-w-sm">
              We are a creative design studio that transforms ideas into bold, memorable, and high-impact visual experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 md:mb-6 text-visionify-navy">Quick Links</h4>
            <ul className="flex flex-col space-y-1 md:space-y-4 text-sm text-gray-700 font-medium">
              <li>
                <Link href="/" className="flex items-center min-h-[48px] md:min-h-0 hover:text-visionify-cyan active:text-visionify-purple transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/work" className="flex items-center min-h-[48px] md:min-h-0 hover:text-visionify-cyan active:text-visionify-purple transition-colors">Our Work</Link>
              </li>
              <li>
                <Link href="/collaborations" className="flex items-center min-h-[48px] md:min-h-0 hover:text-visionify-cyan active:text-visionify-purple transition-colors">Collaborations</Link>
              </li>
              <li>
                <Link href="/get-a-quote" className="flex items-center min-h-[48px] md:min-h-0 hover:text-visionify-cyan active:text-visionify-purple transition-colors">Get a Quote</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 md:mb-6 text-visionify-navy">Contact Details</h4>
            <ul className="flex flex-col space-y-1 md:space-y-4 text-sm text-gray-700 font-medium">
              <li>
                <a href="mailto:official.visionify@gmail.com" className="flex items-center min-h-[48px] md:min-h-0 gap-3 hover:text-visionify-cyan active:text-visionify-purple transition-colors group">
                  <Mail size={18} className="text-visionify-purple group-hover:text-visionify-cyan group-active:text-visionify-purple" />
                  <span className="break-all">official.visionify@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+918306030996" className="flex items-center min-h-[48px] md:min-h-0 gap-3 hover:text-visionify-cyan active:text-visionify-purple transition-colors group">
                  <Phone size={18} className="text-visionify-purple group-hover:text-visionify-cyan group-active:text-visionify-purple" />
                  +91 83060 30996
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/visionify_official/" target="_blank" rel="noreferrer" className="flex items-center min-h-[48px] md:min-h-0 gap-3 hover:text-visionify-cyan active:text-visionify-purple transition-colors group">
                  <Camera size={18} className="text-visionify-purple group-hover:text-visionify-cyan group-active:text-visionify-purple" />
                  @visionify_official
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {currentYear > 2026 ? currentYear : 2026} Visionify. All Rights Reserved.
          </p>
          <p className="text-sm text-gray-400 italic">
            Crafted with colour, creativity and vision.
          </p>
        </div>
      </div>
    </footer>
  );
}
