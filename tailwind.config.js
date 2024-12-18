/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      'off-white': '#f3f3f3',
      'gray': '#888888',
      'green': '#00DD33',
      'yellow': '#FFFF33',
    },
    fontFamily: {
      title: ['Audiowide','serif'],
      sans: ['Roboto','sans-serif'],
      serif: ['Roboto Serif','serif'],
    },
  },
  plugins: [],
}
