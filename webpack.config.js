const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line
module.exports = (env, { devserver = false }) => {
  const isProd = env === 'production';

  return {
    context: __dirname,
    devtool: isProd ? false : 'eval-source-map',
    entry: './src/app.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProd ? 'app.min.js' : 'app.js',
    },
    mode: isProd ? 'production' : 'development',
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 8080,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/,

        },
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true,
          },
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader?sourceMap',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: true,
                localIdentName: isProd ? '[hash:base64:5]' : '[path]___[name]__[local]___[hash:base64:5]',
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          loaders: [
            'style-loader?sourceMap',
            'css-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      isProd ? null : new BundleAnalyzerPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
    ].filter(plugin => !!plugin),
  };
};
