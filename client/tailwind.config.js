/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        customGrey: '#A6A0A0',
        customLightGrey: '#ADB7C0',
        customBlue: '#94C5CC',
        customPink: '#F4ADB3',
        customLightPink: '#EEBCB1',
        customYellow: '#ECD89D',
        customWhite: '#F4E3D3',
        customPurple: '#D7CADE'
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
    },
    },
  },
  plugins: [],
}