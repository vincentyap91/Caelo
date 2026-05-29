/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      letterSpacing: {
        tight: 'var(--tracking-tight)',
        wide: 'var(--tracking-wide)',
        code: 'var(--tracking-code)',
      },
      keyframes: {
        'home-marquee-vertical-y': {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(0, -50%, 0)' },
        },
        /** Hero announcement strip: starts in view, scrolls left (config is source of truth for Tailwind). */
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'home-marquee-vertical-y': 'home-marquee-vertical-y 40s linear infinite',
        marquee: 'marquee 11s linear infinite',
      },
    },
  },
  plugins: [],
};
