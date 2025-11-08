/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Capacitor
  output: process.env.BUILD_MODE === 'static' ? 'export' : undefined,
  
  // Disable image optimization for static export
  images: {
    unoptimized: process.env.BUILD_MODE === 'static',
  },

  // Trailing slash for better compatibility
  trailingSlash: true,

  // Asset prefix for Capacitor
  assetPrefix: process.env.BUILD_MODE === 'static' ? '' : undefined,

  // React strict mode
  reactStrictMode: true,

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

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

