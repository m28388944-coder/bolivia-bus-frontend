/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          500: '#1B2A6B',
          600: '#162259',
          700: '#111a47',
        },
        gold: '#D4AF37',
        red: '#C8102E',
      },
    },
  },
  plugins: [],
}
