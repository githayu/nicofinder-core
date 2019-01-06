const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlgin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (env, args) => {
  // console.log(env, args, process.env.NODE_ENV)

  const mode = process.env.NODE_ENV || 'development'
  const PRODUCTION = mode === 'production'

  return {
    mode,
    entry: {
      index: [path.resolve(__dirname, './src/index.ts')],
    },
    output: {
      filename: PRODUCTION ? '[hash].js' : '[name].js',
      path: path.resolve(__dirname, './dist'),
      library: 'NicofinderCore',
      libraryTarget: 'umd',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.scss'],
      alias: {
        '~': path.join(__dirname, './src/'),
      },
    },
    externals: [
      {
        react: 'react',
        'react-dom': 'react-dom',
        moment: 'moment',
      },
      /^@material-ui/,
    ],
    devtool: PRODUCTION ? false : 'inline-source-map',
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

        {
          test: /\.module\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                sourceMap: !PRODUCTION,
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
      new CleanWebpackPlgin(['dist']),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja/),
      // new BundleAnalyzerPlugin(),
    ],
  }
}
