/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6f61',
          dark: '#e5635b',
          light: '#ff8a7f'
        }
      }
    },
  },
  plugins: [],
};