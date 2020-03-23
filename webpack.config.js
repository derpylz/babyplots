const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './babyplots.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'babyplots.js',
        libraryTarget: 'var',
        library: 'Baby'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
        ]
    }
}