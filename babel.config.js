module.exports = function(api) {
  api.cache(true);

  const presets = ['@babel/preset-react', '@babel/preset-env'];
  const plugins = ['lodash', 'transform-es2015-modules-commonjs'];

  return {
    presets,
    plugins,
  };
};
