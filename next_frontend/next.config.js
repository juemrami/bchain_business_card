
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
}
