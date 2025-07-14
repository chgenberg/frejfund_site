/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle Supabase dependencies
      config.resolve.alias = {
        ...config.resolve.alias,
        '@supabase/realtime-js': false,
        'ws': false,
        'net': false,
        'tls': false,
        'fs': false,
        'crypto': false,
        'stream': false,
        'http': false,
        'https': false,
        'zlib': false,
        'path': false,
        'os': false,
        'util': false,
        'assert': false,
        'url': false,
        'buffer': false,
        'process': false,
        'events': false,
        'string_decoder': false,
        'querystring': false,
        'constants': false,
        'timers': false,
        'dns': false,
        'dgram': false,
        'child_process': false,
        'module': false,
        'vm': false,
        'worker_threads': false,
        'perf_hooks': false,
        'async_hooks': false,
        'cluster': false,
        'readline': false,
        'repl': false,
        'tty': false,
        'v8': false,
        'inspector': false,
        'domain': false,
        'punycode': false,
      }
    }
    return config
  },
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
}

module.exports = nextConfig 