const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: "process/browser.js",
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: false,
          crypto: false,
        },
      },
    },
  },
};

// const reactDotenv = require("react-dotenv");

// module.exports = {
//   webpack: {
//     configure: (webpackConfig) => {
//       // Add react-dotenv plugin to the webpack configuration
//       webpackConfig.plugins = webpackConfig.plugins.concat(reactDotenv);
//       return webpackConfig;
//     },
//   },
// };
