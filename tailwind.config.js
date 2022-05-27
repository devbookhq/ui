module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
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
          700: '#313034',
        },
        green: {
          500: '#0AC069',
          200: '#71DFAB',
        },
        red: {
          400: '#FC4F60',
        },
        gray: {
          800: '#8F8F8F',
          700: '#B1B1B1',
          600: '#979797',
          550: '#CBCBCB',
          500: '#D1D1D1',
          400: '#DBDBDB',
          300: '#DEDEDE',
          200: '#E9E9E9',
          100: '#F0F0F0',
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
