module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
    // esta línea es obligatoria para que Reanimated funcione, debe ser el ÚLTIMO plugin en la lista
  };
};