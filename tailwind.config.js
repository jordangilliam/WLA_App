/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // WLA Brand Colors
        'wla-blue': '#0891B2',
        'wla-orange': '#EA580C',
        'wla-olive': '#84A98C',
        'wla-forest': '#2F4F4F',
        // String Theory Colors
        'string-gold': '#D4AF37',
        'string-black': '#1A1A1A',
        // WildPraxis Colors
        'wild-sunset': '#F59E0B',
        'wild-earth': '#92400E',
      },
    },
  },
  plugins: [],
}

