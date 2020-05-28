const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { withTypeScriptAsync } = require('@expo/webpack-config/addons');
const { getExpoBabelLoader } = require('@expo/webpack-config/utils');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias['react-native'] = 'react-native-web';

  const configTS = await withTypeScriptAsync(config, env);

  return configTS;
};