/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  // Ensure we're not using any port-specific configuration
  server: {
    port: process.env.PORT || 10000,
  },
}

module.exports = nextConfig 