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
          700: '#29282Fj',
          650: '#292929',
          600: '#979797',
          600: '#363636',
          500: '#313034',
        },
        green: {
          400: '#0AC069',
          500: '#0AC069',
          200: '#71DFAB',
        },
        red: {
          400: '#FC4F60',
        },
        gray: {
          800: '#8F8F8F',
          700: '#B1B1B1',
          600: '#BBBBBB',
          550: '#CBCBCB',
          500: '#D1D1D1',
          400: '#DBDBDB',
          300: '#DEDEDE',
          200: '#E9E9E9',
          100: '#F0F0F0',
        },
        denim: {
          800: '#373D47',
          700: '#3C4A5D',
          400: '#6A7380',
          300: '#6F7885',
          200: '#898F99',
          100: '#AEAFB2',
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
