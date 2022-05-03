module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      lineClamp: {
        10: '10',
      },
      colors: {
        transparent: 'transparent',
        white: {
          900: '#FFFFFF',
        },
        black: {
          900: '#0E0D11',
          800: '#1A191D',
          700: '#29282Fj',
          600: '#979797',
          500: '#313034',
        },
        green: {
          500: '#0AC069',
          200: '#71DFAB',
        },
      },
      height: {
        inherit: 'inherit',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
