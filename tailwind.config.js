module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.75rem',
        xs: '0.8125rem',
      },
    },
    colors: {
      transparent: 'transparent',
      black: {
        900: '#141414',
        800: '#1F1F1F',
        700: '#262626',
        650: '#292929',
        600: '#363636',
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
  },
  variants: {
    scrollbar: ['dark'],
    extend: {
      backgroundColor: ['active', 'disabled'],
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  corePlugins: {
    preflight: false,
  },
}
