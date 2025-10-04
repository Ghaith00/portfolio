import type { NextConfig } from "next";

const prodconfig = process.env.NODE_ENV === 'production' && { output: 'standalone' };

const nextConfig: NextConfig = {
  /* config options here */
};

export default { ...nextConfig, ...prodconfig };
