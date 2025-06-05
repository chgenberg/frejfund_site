/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3004', 'frejfund.com', 'www.frejfund.com'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // eller specificera domäner
      },
    ],
  },
}

module.exports = nextConfig 