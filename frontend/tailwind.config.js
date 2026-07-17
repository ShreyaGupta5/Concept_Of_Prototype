/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#0F172A', muted: '#64748B', brand: { DEFAULT: '#4F46E5', dark: '#4338CA' } }, fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Poppins', 'sans-serif'], number: ['Manrope', 'sans-serif'] }, boxShadow: { soft: '0 12px 38px rgba(15,23,42,.08)' } } },
  plugins: []
};
