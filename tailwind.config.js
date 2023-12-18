/** @type {import('tailwindcss').Config} */


const primaryColor = "#FFC801";
const secondaryColor = "#E9E9E9";


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: primaryColor,
      white: "#ffffff",
      black: "#000000",
      "light-grey": "#BCBFC7",
      gray: "#A9A9A9",
      "light-black": "#1E1E1E",
      "dark-gray": "#54606C",
      green: "#08C849",
      red: "#EF2B2B",
      yellow: "#E2B201",
      blue: "#1DA9F8",
    },
    backgroundColor: {
      transparent: "transparent",
      primary: primaryColor,
      secondary: secondaryColor,
      page: "#ffffff",
      white: "#ffffff",
      gray: "#E9E9E9",
      green: "#08C849",
      red: "#EF2B2B",
      yellow: "#FFC801",
      "light-white": "#F9F9F9",
      "another-white": "#FFFBEC",
      pink: "rgba(239, 43, 43, 0.04)",
      'light-green': 'rgba(8, 200, 73, 0.2)',
      'dark-pink': 'rgba(239, 43, 43, 0.2)',
      'card-yellow': '#FFFBEC',
    },
    borderColor: {
      DEFAULT: "#EAEAEA",
      primary: primaryColor,
      transparent: "transparent",
      gray: "#EAEAEA",
      yellow: "#FFC801",
    },
    borderRadius: {
      DEFAULT: "4px",
      sm: "2px",
      full: "999999px",
      "2xl": "1rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
    boxShadow: {
      DEFAULT: "0px 0.5rem 1.5rem rgba(0, 0, 0, 0.06)",
    },
    maxWidth: {
      '48': "12rem",
      '6xl': '72rem',
      '2xl': '40rem',
      'xs': '15rem',
    },
    extend: {
      spacing: {
        30: "7.5rem",
        35: "8.75rem",
        38: "9.5rem",
        50: "12.5rem",
        96: "24rem",
        100: "25rem",
        "-5": "-1.25rem",
      },
      screens: {
        '<sm': { 'raw': '(max-width: 639.9px)' },
        '@sm': { 'raw': '(min-width: 640px) and (max-width: 767.9px)' },
        '<md': { 'raw': '(max-width: 1279.9px)' },
        '@md': { 'raw': '(min-width: 768px) and (max-width: 1023.9px)' },
        '<lg': { 'raw': '(max-width: 1279.9px)' },
        '@lg': { 'raw': '(min-width: 1024px) and (max-width: 1279.9px)' },
        '<xl': { 'raw': '(max-width: 1279.9px)' },
        '@xl': { 'raw': '(min-width: 1280px) and (max-width: 1535.9px)' },
        '<2xl': { 'raw': '(max-width: 1279.9px)' },
        '@2xl': { 'raw': '(min-width: 1536px)' },
      },
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

