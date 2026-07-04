import { Calendar, Users, Mail, Phone, MapPin } from "lucide-react";
import CommunityForm from "@/components/CommunityForm";

export default function CommunityCollaborations() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-visionify-navy tracking-tight mb-6">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-visionify-cyan to-visionify-purple">Collaborations</span>
          </h1>
          <p className="text-lg text-gray-600">
            We love working with vibrant communities and university groups. If you're hosting an event, festival, or a major gathering, let's create something extraordinary together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Section */}
          <div className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-visionify-navy mb-4">Why Partner With Us?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Visionify has a strong track record of elevating community events through premium visual design. Whether you need an entire branding package, striking posters, or engaging social media campaigns, we provide top-tier creative support.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-visionify-cyan/10 flex items-center justify-center shrink-0">
                  <Users className="text-visionify-cyan" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-visionify-navy text-lg">Student Organizations</h3>
                  <p className="text-gray-500 mt-1">Special packages and dedicated creative support for college fests and clubs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-visionify-purple/10 flex items-center justify-center shrink-0">
                  <Calendar className="text-visionify-purple" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-visionify-navy text-lg">Major Events & Festivals</h3>
                  <p className="text-gray-500 mt-1">End-to-end design solutions from early promotions to post-event highlights.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-gray-100">
               <h3 className="font-bold text-visionify-navy text-lg mb-4">Quick Contact</h3>
               <div className="flex flex-col gap-3">
                 <a href="mailto:official.visionify@gmail.com" className="flex items-center gap-3 text-gray-600 hover:text-visionify-cyan transition-colors font-medium">
                   <Mail size={18} className="text-visionify-cyan" /> official.visionify@gmail.com
                 </a>
                 <a href="tel:+918306030996" className="flex items-center gap-3 text-gray-600 hover:text-visionify-cyan transition-colors font-medium">
                   <Phone size={18} className="text-visionify-purple" /> +91 83060 30996
                 </a>
               </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <CommunityForm />
          </div>
        </div>

      </div>
    </div>
  );
}
