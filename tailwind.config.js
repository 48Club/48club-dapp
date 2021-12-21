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
      'gray': '#A9A9A9',
      'light-black': '#1E1E1E',
      'dark-gray': '#54606C',
      'green': '#08C849',
      'red': '#EF2B2B'
    },
    backgroundColor: {
      'transparent': 'transparent',
      'primary': primaryColor,
      'secondary': secondaryColor,
      'page': '#ffffff',
      'white': '#ffffff',
      'gray': '#E9E9E9',
      'green': '#08C849',
      'red': '#EF2B2B'
    },
    borderColor: {
      DEFAULT: '#EAEAEA',
      'primary': primaryColor,
      'transparent': 'transparent',
      'gray': '#EAEAEA'
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '2px',
      'full': '999999px',
    },
    boxShadow: {
      DEFAULT: '0px 8px 24px rgba(0, 0, 0, 0.06)',
    },
    maxWidth: {
      '48': '12rem'
    },
    extend: {
      spacing: {
        '30': '7.5rem',
        '50': '12.5rem',
        '100': '25rem',
        '96': '24rem',
        '-5': '-1.25rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
