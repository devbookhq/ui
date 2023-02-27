const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-jet-brains)', ...fontFamily.mono],
      },
      lineClamp: { 10: '10' },
      transparent: 'transparent',
      spacing: {
        120: '30rem',
      },
      lineClamp: {
        10: '10',
      },
      height: {
        inherit: 'inherit',
      },
      colors: {
        gray: {
          100: '#FBFBFB',
        },
        green: {
          400: '#E9F5E6',
          800: '#20BC69',
        },
        cyan: {
          100: '#b3d1fb',
          200: '#AFCDF3',
          500: '#5BA0FA',
        }
      },
      height: { inherit: 'inherit' },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
      },
      animation: { wiggle: 'wiggle 0.3s ease 2' },
      overflow: { 'auto-important': 'auto !important' },
      flex: { 'guide-card': '1 1 30%' },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
}
