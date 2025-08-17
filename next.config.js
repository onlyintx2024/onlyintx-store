// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['printful.com', 'files.cdn.printful.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/printful/:path*',
        destination: 'https://api.printful.com/:path*',
      },
    ];
  },
}