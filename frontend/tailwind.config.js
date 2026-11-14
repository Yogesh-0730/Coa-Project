/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e7e9ef',
          100: '#c3c8d8',
          200: '#9ba4be',
          300: '#7380a4',
          400: '#556591',
          500: '#374a7e',
          600: '#314376',
          700: '#2a3a6b',
          800: '#233161',
          900: '#16204e',
          950: '#0a1128',
        },
        electric: {
          50: '#e0f0ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#2693ff',
          500: '#0080ff',
          600: '#0070e6',
          700: '#005cbf',
          800: '#004999',
          900: '#003366',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
