/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            50: '#faf5fa',
            100: '#f5ebf5',
            200: '#ebd6eb',
            300: '#d6b2d6',
            400: '#c08dc0',
            500: '#a868a8', // Your primary color
            600: '#8a538a',
            700: '#6b416b',
            800: '#4d2f4d',
            900: '#2e1c2e',
            950: '#1a101a',
          },
          dark: '#131418', // Your background color
          light: '#93a2c6',
          gold: '#9c7244',
          accent: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
