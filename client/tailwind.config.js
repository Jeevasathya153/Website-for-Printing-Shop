/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Tamil Nadu Cultural Colors
        'tamil-maroon': {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ec7691',
          500: '#e04a6d',
          600: '#c62a52',
          700: '#8B0000', // Traditional Kumkum Red
          800: '#6B0F1A',
          900: '#5c1524',
          950: '#340711',
        },
        'tamil-gold': {
          50: '#fefdf7',
          100: '#fdf9e3',
          200: '#faf0bc',
          300: '#f6e38a',
          400: '#f0d152',
          500: '#DAA520', // Temple Gold
          600: '#c99a0d',
          700: '#a67c0e',
          800: '#896113',
          900: '#735015',
          950: '#432b08',
        },
        'tamil-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#228B22', // Temple/Banana Leaf Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'tamil-saffron': {
          500: '#FF6600', // Saffron Orange
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      fontFamily: {
        'tamil': ['Noto Sans Tamil', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'kolam-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DAA520' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'temple-border': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B0000' fill-opacity='0.05'%3E%3Cpath d='M20 0L0 20h40z M20 40L0 20h40z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

