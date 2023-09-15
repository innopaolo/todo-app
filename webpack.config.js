const path = require("path");
const HTMLWebpackPlugin = require ("html-webpack-plugin");


module.exports = {
    entry: "./src/index.js",
    devtool: "inline-source-map",
    plugins: [
        new HTMLWebpackPlugin({
            title: "One Piece Todo",
            template: "./src/index.html",
        }),
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }],
                        ],
                    },
                },
            },
        ],
    },
};