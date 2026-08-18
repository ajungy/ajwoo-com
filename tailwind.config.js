/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tokens/tailwind.preset.js')],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        // reference/components.md — empty states are centred at max-width 360.
        'app-empty': '360px',
      },
    },
  },
};
