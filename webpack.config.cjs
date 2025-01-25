const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react', {
                            runtime: 'automatic',
                        }]],
                    },
                },
            }
        ]
    },
    entry: {
        main: './src/js/index.js',
        popup: './src/js/popup.js',
        background: './src/js/background.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'icons', to: 'icons' },
                { from: 'model', to: 'model' },
                { from: 'src/html', to: 'html' },
                { from: 'src/css', to: 'css' },
            ],
        }),
    ],
}