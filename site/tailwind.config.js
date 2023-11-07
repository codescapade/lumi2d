/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,md}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["winter", "night"],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

