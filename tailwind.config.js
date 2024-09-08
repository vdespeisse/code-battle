/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        beige: 'rgba(255, 255, 255, 0.87)',
        'layer-0': '#0f0f0f',
        'layer-1': 'rgb(40, 40, 40)',
        'layer-2': '#323232',
        'layer-3': '#3a3a3a',
        'layer-4': '#424242',
        'layer-5': '#4f4f4f',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
