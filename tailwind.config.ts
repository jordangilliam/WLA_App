import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // WLA Brand Colors (from logo)
        wla: {
          blue: '#0891B2',        // Vibrant cyan from fish
          orange: '#EA580C',      // Warm orange from bird
          olive: '#84A98C',       // Olive/sage from deer
          forest: '#2F4F4F',      // Deep forest green
        },
        // String Theory (developer brand)
        string: {
          gold: '#D4AF37',        // Brass/gold
          black: '#1A1A1A',       // Sophisticated black
        },
        // WildPraxis Colors
        wild: {
          sunset: '#F59E0B',      // Sunset orange
          earth: '#92400E',       // Earth brown
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slide-up 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'marker-pulse': 'marker-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.8)' },
        },
        'marker-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
