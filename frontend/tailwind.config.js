/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0c0c0c',
        surface: '#141414',
        border: '#222222',
        muted: '#555555',
        accent: '#e2e2e2',
        primary: '#ffffff',
      }
    },
  },
  plugins: [],
}