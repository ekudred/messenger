const CracoLessPlugin = require('craco-less')

const modifyVars = {
  '@layout-header-background': 'rgba(0, 0, 0, 0.85)',
  '@layout-header-height': '48px',
  '@layout-header-color': '#ffffff',
  '@layout-header-padding': '0 16px',
  '@layout-sider-background': '#ffffff',

  '@drawer-body-padding': '0',
  '@drawer-header-close-size': '48',

  '@layout-trigger-background': '#ffffff',
  '@layout-trigger-color': 'rgba(0, 0, 0, 0.85)',

  '@tabs-bar-margin': '0',
  '@tabs-horizontal-padding': '4px 8px',
  '@tabs-vertical-padding': '4px 16px 4px 16px',
  '@tabs-vertical-margin': '0'
}

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars,
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
