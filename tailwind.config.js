/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        'pink-soft': '#F8BBD0',
        'rose': '#E91E63',
        'lavender': '#E6E6FA',
        'warm-white': '#FDF5E6',
        'dark-luxury': '#1A1A1A',
        'gold-accent': '#D4AF37',
        'deep-black': '#0A0A0A',
        'elegant-white': '#F8F6F3',
        'starlight-glow': '#FFF8DC',
      },
      screens: {
        'xs': '320px',
        'sm': '375px',
        'ms': '390px',
        'ml': '414px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 157, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 157, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
