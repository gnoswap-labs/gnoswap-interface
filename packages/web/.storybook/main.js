const { dirname, join } = require("node:path");

const { merge } = require("webpack-merge");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {
      nextConfigPath: "../next.config.js",
    },
  },
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [require.resolve("@emotion/babel-preset-css-prop")],
      },
    });
    return merge(config, {
      experiments: {
        topLevelAwait: true,
      },
      resolve: {
        plugins: [new TsconfigPathsPlugin()],
      },
    });
  },
  docs: {
    autodocs: true,
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
