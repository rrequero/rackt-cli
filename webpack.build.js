var path = require('path');
var webpack = require('webpack');
var BASE_DIR = process.cwd();
var COMPONENT_FILE = process.env.COMPONENT_FILE;
var COMPONENT_NAME = process.env.COMPONENT_NAME;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var plugins = [];

plugins.push(new ExtractTextPlugin(COMPONENT_FILE + '.css', {
    allChunks: true
}));

function getPackageMain() {
    return require(path.resolve(BASE_DIR, 'package.json')).main;
}

if(process.env.MINIFY) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
    COMPONENT_FILE += '.min';
}

module.exports = {
    entry: path.resolve(BASE_DIR, getPackageMain()),
    output: {
        filename: path.resolve(BASE_DIR, 'dist/' + COMPONENT_FILE + '.js'),
        library: COMPONENT_NAME,
        libraryTarget: 'umd'
    },
    externals: {
        'react': 'React',
        'react/addons': 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: path.resolve(process.env.RACKT_PATH, 'node_modules/babel-loader')
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract(process.env.RACKT_PATH,"node_modules/style-loader"),path.resolve(process.env.RACKT_PATH,"node_modules/css-loader") + '!' + path.resolve(process.env.RACKT_PATH,"node_modules/sass-loader"))
        }]
    },
    plugins: plugins
};
