/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        surface: '#161b22',
        'surface-hover': '#1c2128',
        border: '#30363d',
        muted: '#8b949e',
        primary: '#e6edf3',
        accent: '#58a6ff',
        'btn-primary': '#238636',
      }
    },
  },
  plugins: [],
}