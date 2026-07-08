"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface JobOpening {
  id: string;
  title: string;
  slug: string;
  job_type: string;
  location: string;
  short_description: string;
  perks: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-visionify-navy mb-4 tracking-tight"
          >
            Join Visionify
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Explore current opportunities and build meaningful visual experiences with us.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-visionify-cyan"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-visionify-navy mb-4 group-hover:text-visionify-cyan transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {job.job_type && (
                      <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <Briefcase size={16} className="mr-2" />
                        {job.job_type}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <MapPin size={16} className="mr-2" />
                        {job.location}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {job.short_description}
                  </p>
                  {job.perks && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Perks:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.perks}</p>
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="flex items-center justify-between text-visionify-cyan font-semibold hover:text-visionify-navy transition-colors w-full"
                  >
                    Apply Now
                    <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-visionify-navy mb-2">No Open Positions</h3>
            <p className="text-gray-600">We aren't actively hiring right now, but please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
