/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      'main-bg': {
        'background-color': 'rgba(181, 80, 20, 1)',
        'background-image': 'radial-gradient(circle, rgba(181, 80, 20, 1) 0%, rgba(255, 171, 17, 1) 100%)'  ,
        'background-size': '400% 400%',
        'animation': 'gradient 15s ease infinite'
      },
      'z-index-5':{
        'z-index': 5
      }
    },
  },
  plugins: [],
};
