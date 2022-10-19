const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: './src/index.js',
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html', // 指定入口模板文件（相对于项目根目录）
            filename: 'index.html', // 指定输出文件名和位置（相对于输出目录）
        })    
    ],
    output: {
        filename: '[name].bundle.js',
        //filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single'
    },
    devServer: {
        static: './dist',
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                secure: false,
                changeOrigin: true
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader'
            }
        ]
    }
}