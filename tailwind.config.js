const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/cinnamon/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /*  mainBlue: '#4554fb', */
        mainBlue: '#00a3fe',
        mainText: '#293241',
      },
      transitionProperty: {
        height: 'height',
        maxHeight: 'max-height',
      },
      fontFamily: {
        Montserrat: ['Montserrat', 'sans-serif'],
        Karla: ['Karla', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
});
