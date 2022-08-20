/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Pacifico', 'cursive'],
        body: ['Montserrat', 'sans-serif'],
        timer: ['Azeret Mono', 'monospace']
      },
      colors: {
        bgDark: '#122333',
        dark: '#182B3C',
        bgLight: '#264059',
        primary: '#2EAC67',
        danger: '#f2415c',
        secondary: '#5246CD',
        bgmodal: '#273A4B'
      },
    },
  },
  plugins: [],
}
