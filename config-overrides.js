// config-overrides.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function override(config, env) {
  if (env === 'production') {
    // Ensure source maps are disabled
    config.devtool = false;

    // Configure optimization
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
            mangle: true,
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    };
  }

  return config;
}