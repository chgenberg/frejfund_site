/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3004', 'frejfund.com', 'www.frejfund.com'],
    },
  },
  images: {
    domains: ['localhost', 'frejfund.com', 'www.frejfund.com'],
  },
}

module.exports = nextConfig 