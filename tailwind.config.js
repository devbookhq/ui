module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          900: '#0E0D11',
          800: '#1A191D',
          700: '#29282Fj',
        },
      },
      height: {
        inherit: 'inherit',
      },
    },
  },
}
