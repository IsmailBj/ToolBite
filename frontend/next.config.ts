// import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    // Completely disable local Node bundling for the ONNX engine
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node": false,
    };
    return config;
  },
  // Adding this empty object satisfies Next.js 16 Turbopack requirements
  turbopack: {},
};

export default nextConfig;
