/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,md}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["corporate", "night"],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

