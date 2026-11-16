import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#33a852',
          'green-dark': '#23833e',
          teal: '#0e5d59',
          ink: '#183b35',
          canvas: '#f7faf7',
          line: '#e3ece4',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 50px rgba(23, 61, 47, 0.09)',
      },
      backgroundImage: {
        'hero-wash': 'linear-gradient(90deg, rgba(13, 47, 39, .69) 0%, rgba(13, 47, 39, .28) 54%, rgba(13, 47, 39, .03) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
