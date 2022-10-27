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
        // We are currently using `-amber-` colors from the default palette (shades 50,100,200,300,400,800)
        // Tailwind recommends https://palettte.app/ and https://colorbox.io/ for creating your palettes
      },
    },
  },
  plugins: [require('tailwindcss-radix')()],
}
