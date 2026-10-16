/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Theme Switcher-ისთვის (ნაბიჯი 2)
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9f3',
          100: '#d5f0e3',
          500: '#2f9e6b',
          600: '#248556',
          700: '#1c6a45',
        },
        ink: {
          900: '#1a2332',
          700: '#334155',
          500: '#64748b',
        },
      },
      fontFamily: {
        sans: ['"FiraGO"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}