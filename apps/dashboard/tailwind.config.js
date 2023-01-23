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
        green: {
          600: '#38A169',
          500: '#3DE884',
        },
        // We are currently using `-green-` colors from the default palette (shades 50,100,200,300,400,800)
        // Tailwind recommends https://palettte.app/ and https://colorbox.io/ for creating your palettes
      },
    },
  },
  plugins: [require('tailwindcss-radix')()],
}
