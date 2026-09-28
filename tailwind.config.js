/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F5EE',
          100: '#D1EBDD',
          200: '#A3D7BB',
          300: '#75C399',
          400: '#48AF77',
          500: '#2D6A4F',
          600: '#1B4332', // Deep Forest Green (Primary)
          700: '#143326',
          800: '#0E241B',
          900: '#07120D',
          DEFAULT: '#1B4332',
        },
        amber: {
          50: '#FDF8F3',
          100: '#FAF0E6',
          200: '#F4E1CE',
          300: '#EED2B5',
          400: '#E2B88E',
          500: '#D4A373', // Warm Golden Amber (Secondary)
          600: '#BC8A58',
          700: '#9A6E43',
          800: '#775331',
          900: '#553920',
          DEFAULT: '#D4A373',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFCFB',
          200: '#FBF8F3', // Soft Organic Cream (Background)
          300: '#F5EFE6',
          400: '#EBE2D5',
          DEFAULT: '#FBF8F3',
        },
        charcoal: {
          50: '#F6F7F7',
          100: '#E2E4E3',
          200: '#C4C8C6',
          300: '#949B98',
          400: '#5E6662',
          500: '#1F2421', // Charcoal Black (Primary Text)
          600: '#191D1A',
          700: '#131614',
          800: '#0D0F0E',
          900: '#060707',
          DEFAULT: '#1F2421',
        },
        muted: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Muted Gray (Secondary Text)
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          DEFAULT: '#6B7280',
        },
        // Direct semantic alias mappings
        primary: {
          DEFAULT: '#1B4332',
          dark: '#143326',
          light: '#2D6A4F',
        },
        secondary: {
          DEFAULT: '#D4A373',
          dark: '#BC8A58',
          light: '#E2B88E',
        },
        background: {
          DEFAULT: '#FBF8F3',
          card: '#FFFFFF',
        },
        card: '#FFFFFF',
        text: {
          primary: '#1F2421',
          muted: '#6B7280',
          light: '#9CA3AF',
        }
      },
    },
  },
  plugins: [],
};
