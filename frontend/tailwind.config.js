/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Noto Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        bg: '#0d1117',
        surface: '#161b22',
        'surface-hover': '#1c2129',
        border: '#30363d',
        'border-hover': '#484f58',
        muted: '#8b949e',
        accent: '#58a6ff',
        primary: '#e6edf3',
        success: '#3fb950',
        danger: '#f85149',
        'btn-primary': '#238636',
        'btn-primary-hover': '#2ea043',
      },
      borderRadius: {
        gh: '6px',
      },
    },
  },
  plugins: [],
}