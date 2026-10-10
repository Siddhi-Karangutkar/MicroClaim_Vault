/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00ffcc', // Custom neon color for accents
        dark: '#0f172a',
        glass: 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
