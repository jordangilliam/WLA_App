/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Capacitor
  output: process.env.BUILD_MODE === 'static' ? 'export' : undefined,
  
  // Image optimization configuration
  images: {
    unoptimized: process.env.BUILD_MODE === 'static',
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Trailing slash for better compatibility
  trailingSlash: true,

  // Asset prefix for Capacitor
  assetPrefix: process.env.BUILD_MODE === 'static' ? '' : undefined,

  // React strict mode
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js', 'mapbox-gl'],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Explicitly set @ alias for path resolution
    const path = require('path')
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    }

    return config
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },

  // PWA configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

