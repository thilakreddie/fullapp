/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    allowedDevOrigins: ['http://192.168.68.109', 'http://127.0.0.1', 'http://localhost']
  }
};

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};