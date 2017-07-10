var path = require('path');
var webpack = require('webpack');

const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PROD = process.env.NODE_ENV === 'prod';

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
});

var plugins = [
    // Find duplicate dependancies and share them across all bundles
    // Allows us to move vendor code into separate file
    new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor', 'main'].reverse(),
        minChunks: Infinity
    }),

    // Copy index.html file to dist folder
    new CopyWebpackPlugin([
        { from: 'src/assets/', to: 'assets/' },
        { from: 'src/index.html', to: 'index.html' }
    ]),

    // Prevent warning: 5644:15-36 Critical dependency: the request of a dependency is an 
    // expression in ./node_modules/@angular/core/@angular/core.es5.js
    new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, '../src')
    ),
    extractSass
];

if (PROD) {
    // If in Production, Uglify code
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
    // Create source maps in seperate files
    devtool: PROD ? 'nosources-source-map' : 'cheap-module-source-map',

    // Entry points for Webpack to find dependancies
    entry: {
        polyfills: './src/polyfills.ts',
        vendor: './src/vendor.ts',
        main: './src/main.ts'
    },

    // Output bundles
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    //Webpack Dev Server Settings
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    module: {
        rules: [{
                test: /\.ts$/,
                use: [
                    { loader: 'ng-router-loader' },
                    { loader: 'awesome-typescript-loader' },
                    { loader: 'angular2-template-loader' }
                ]
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.html/,
                use: [{ loader: 'raw-loader' }],
                exclude: [path.join(__dirname, 'src/index.html')]
            },
            {
                test: /component\.css$/,
                use: [
                    { loader: 'to-string-loader' },
                    { loader: 'css-loader' },
                ]
            },
            {
                test: /styles\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' },
                    ]
                })
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
}