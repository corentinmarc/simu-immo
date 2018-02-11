const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname,
    devtool: "eval-source-map",
    entry: "./src/app.js",
    output: {
        path: __dirname + "/build",
        filename: "app.min.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread'],
                }
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader?sourceMap',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'sass-loader',
                ]
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader?sourceMap',
                    'css-loader',
                ]
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, "src/js"), path.resolve(__dirname, "src"), "node_modules"]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};