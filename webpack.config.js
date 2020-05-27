const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  config.resolve.alias['react-native-web/dist/exports/Modal'] = 'modal-enhanced-react-native-web';
  
  return config;
};
