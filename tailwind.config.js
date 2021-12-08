const primaryColor = '#13E6FF'
const borderColor = '#323b45'

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    colors: {
      'primary': primaryColor,
      'white': '#ffffff',
      'black': '#000000',
      'light-grey': '#BCBFC7',
    },
    backgroundColor: {
      'transparent': 'transparent',
      'primary': primaryColor,
      'divide': '#323C46',
      'page': '#0F1923',
      'card': '#1A242D',
      'card-hover': '#262F3C',
    },
    borderColor: {
      DEFAULT: borderColor,
      'primary': primaryColor,
      'divide': borderColor,
      'transparent': 'transparent',
      'senior': '#FFD764',
      'junior': '#6EDAE4',
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '2px',
      'full': '999999px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
