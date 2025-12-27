/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors from the code
        'warm-peach': '#E8A98A',
        'sage-green': '#8FAE8B',
        'soft-green': '#B8D4B4',
        'dusty-rose': '#D4A5A5',
        'slate-blue': '#7B9EBD',
        'dark-gray': '#3D3D3D',
        'medium-gray': '#6B6B6B',
      },
    },
  },
  plugins: [],
}