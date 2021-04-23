const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const { resolver } = require("./metro.config");

const root = path.resolve(__dirname, "..");
const node_modules = path.join(__dirname, "node_modules");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    { ...env, offline: false },
    argv
  );

  if (env.mode === "development") {
    // config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new ReactRefreshWebpackPlugin());
  }

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    include: path.resolve(root, "src"),
    use: "babel-loader",
  });

  // We need to make sure that only one version is loaded for peerDependencies
  // So we alias them to the versions in example's node_modules
  Object.assign(config.resolve.alias, {
    ...resolver.extraNodeModules,
    "react-native-web": path.join(node_modules, "react-native-web"),
  });

  return config;
};
