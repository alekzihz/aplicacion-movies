/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'mobile': '375px',
      },
    },
  },
  plugins: [],
}

