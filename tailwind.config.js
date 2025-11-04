/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'redbull-red': '#DC0A2D',
        'redbull-blue': '#1E3A8A',
        'redbull-yellow': '#FDB913',
        'dark-bg': '#0A0E27',
        'dark-card': '#1A1F3A',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
