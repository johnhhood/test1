
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic-sans': ['"Comic Sans MS"', 'Comic Sans', 'cursive'],
      },
      colors: {
        win95gray: '#c0c0c0',
        win95blue: '#00bfff',
        tilebg: '#ffffff',
        sitebg: '#f0f0f0'
      }
    },
  },
  plugins: [],
};
