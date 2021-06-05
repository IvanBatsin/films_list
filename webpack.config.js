const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const setName = (ext) => !isDev ? `[name].[contenthash].${ext}` : `[name].${ext}`;

const setPlugins = () => {
  const plugins = [ 
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      minify: !isDev,
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: setName('css')
    }),
    new WebpackCopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets'),
          to: path.join(__dirname, 'dist', 'assets')
        }
      ]
    })
  ];
  return plugins;
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: ["@babel/polyfill", "./index.js"],
  output: {
    filename: 'index[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: isDev ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimize: !isDev
  },
  devServer: {
    port: 3000,
    compress: true,
    liveReload: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  plugins: setPlugins()
}