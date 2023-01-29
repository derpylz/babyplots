const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/babyplots.ts',
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
            new TerserPlugin({
                parallel: true
            }),
        ]
    }
}