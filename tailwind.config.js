/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-button': '#4BDCB0',
        'brand-border': '#000000',
        'brand-card': '#BBF7F7',
        'brand-bg': '#F2FFFF',
      },
    },
  },
  plugins: [],
}

