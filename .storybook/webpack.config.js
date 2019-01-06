const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  resolve: {
    alias: {
      '~': path.join(__dirname, '../src/'),
    },
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              configFileName: 'tsconfig.json',
            },
          },
          {
            loader: require.resolve('react-docgen-typescript-loader'),
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              localIdentName: '[folder]-[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /^(?!.*\.module).*\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[folder]-[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'css/[name].css',
    // }),
    new HardSourceWebpackPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja/),
    // new BundleAnalyzerPlugin(),
  ],
}
