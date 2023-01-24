module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [require('tailwindcss-radix')()],
}
