import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        // pathname: '/account123/**',
        search: '',
      }
    ]
  },
  experimental  :{
    serverActions:{
      bodySizeLimit:"10mb"
    }
  },
  // webpack: config => {
  //   config.resolve.alias.canvas = false;
  //   config.resolve.alias.encoding = false;
  //   return config;
  // },
};

export default nextConfig;
