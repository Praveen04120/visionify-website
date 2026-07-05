import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-visionify-navy tracking-tight mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple">Us</span>
          </h1>
          <p className="text-lg text-gray-600">
            Looking for a creative design partner? Need designs that make your brand stand out? Let’s create something memorable together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-visionify-navy mb-6">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-visionify-cyan/10 flex items-center justify-center shrink-0">
                <Mail className="text-visionify-cyan" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-visionify-navy text-lg">Email Us</h3>
                <p className="text-gray-500 mt-1">Our friendly team is here to help.</p>
                <a href="mailto:contact@visionify.co.in" className="text-visionify-purple font-medium hover:underline mt-2 block break-all">
                  contact@visionify.co.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-visionify-purple/10 flex items-center justify-center shrink-0">
                <Phone className="text-visionify-purple" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-visionify-navy text-lg">Call Us</h3>
                <p className="text-gray-500 mt-1">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+918306030996" className="text-visionify-cyan font-medium hover:underline mt-2 block">
                  +91 83060 30996
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-visionify-pink/10 flex items-center justify-center shrink-0">
                <MapPin className="text-visionify-pink" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-visionify-navy text-lg">Visit Us</h3>
                <p className="text-gray-500 mt-1">Come say hello at our office HQ.</p>
                <p className="text-visionify-navy font-medium mt-2">
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
}
