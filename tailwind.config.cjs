/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'home-marquee-vertical-y': {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(0, -50%, 0)' },
        },
        /** Hero announcement strip: text moves right → left (must not live only under `@theme` in theme.css — browsers ignore it). */
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'home-marquee-vertical-y': 'home-marquee-vertical-y 40s linear infinite',
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
};
