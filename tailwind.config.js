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
    },
  },
}
