const primaryColor = '#FFC801'
const secondaryColor = '#FEFAE8'

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  important: true,
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
      'secondary': secondaryColor,
      'page': '#ffffff',
      'white': '#ffffff',
    },
    borderColor: {
      DEFAULT: '#EAEAEA',
      'primary': primaryColor,
      'transparent': 'transparent',
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '2px',
      'full': '999999px',
    },
    boxShadow: {
      DEFAULT: '0px 8px 24px rgba(0, 0, 0, 0.06)',
    },
    extend: {
      spacing: {
        '30': '7.5rem',
        '50': '12.5rem',
        '100': '25rem',
        '-5': '-1.25rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
