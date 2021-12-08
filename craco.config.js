const CracoLessPlugin = require('craco-less')
const tailwindConfig = require('./tailwind.config')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': tailwindConfig.theme.colors.primary,
              '@border-color-base': tailwindConfig.theme.borderColor.DEFAULT,
              '@border-color-split': tailwindConfig.theme.borderColor.DEFAULT,
              '@border-radius-base': 0,
              '@component-background': tailwindConfig.theme.backgroundColor.card,
              '@popover-background': tailwindConfig.theme.backgroundColor.card,
              '@layout-header-background': tailwindConfig.theme.backgroundColor.sidebar,
              '@layout-body-background': tailwindConfig.theme.backgroundColor.page,
              '@body-background': tailwindConfig.theme.backgroundColor.page,
              '@text-color': '#ffffff',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://alpha.bnb48club.com',
        changeOrigin: true,
      },
    },
  },
}
