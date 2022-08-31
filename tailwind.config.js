module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '\'JetBrains Mono\'',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      lineClamp: {
        10: '10',
      },
      colors: {
        transparent: 'transparent',
        prisma: {
          500: '#F564A5',
        },
        white: {
          900: '#FFFFFF',
        },
        black: {
          950: '#0A0A0A',
          900: '#0E0D11',
          850: '#15141a',
          800: '#1A191D',
          750: '#212024',
          700: '#313034',
          650: '#2E3034',
          600: '#4F4F4F',
        },
        green: {
          500: '#0AC069',
          200: '#71DFAB',
        },
        navy: {
          500: '#264F78',
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
