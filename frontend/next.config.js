const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin());
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
