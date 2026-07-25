/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#1B4332', dark: '#0F2A1D', light: '#2D6A4F' },
        wheat: { DEFAULT: '#D4A017', light: '#E8C349', dark: '#A67C10' },
        soil: { DEFAULT: '#6B4423', light: '#8B5E34' },
        sage: { 50: '#F5F7F0', 100: '#E9EEDD', 200: '#D6E0C4' },
        clay: '#B5573A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(27, 67, 50, 0.15)',
      },
      backgroundImage: {
        'field-gradient': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #52734D 100%)',
      },
    },
  },
  plugins: [],
};
