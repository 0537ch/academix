/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dde5fd',
          300: '#c3d0fb',
          400: '#9ab1f8',
          500: '#6d8bf4',
          600: '#4865ed',
          700: '#3a4edb',
          800: '#3342b8',
          900: '#2f3c93',
        },
        secondary: {
          50: '#f4f7f7',
          100: '#e2eaea',
          200: '#c5d5d6',
          300: '#9db6b7',
          400: '#708e90',
          500: '#557274',
          600: '#465e60',
          700: '#3d4f50',
          800: '#364344',
          900: '#2f3a3b',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
