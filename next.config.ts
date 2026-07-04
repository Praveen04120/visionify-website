import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'irddmintaiwyjivowkqp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/collaborations',
        destination: '/official-partners',
        permanent: true,
      },
      {
        source: '/get-a-quote',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
