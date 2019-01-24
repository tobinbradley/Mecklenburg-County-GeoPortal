const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  css: {
    sourceMap: true
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },
  configureWebpack: config => {
    //config.module.noParse = /(mapbox-gl)\.js$/;
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new HtmlCriticalWebpackPlugin({
          base: path.resolve(__dirname, 'dist'),
          src: 'index.html',
          dest: 'index.html',
          inline: true,
          minify: true,
          extract: true,
          dimensions: [
            {
              height: 200,
              width: 400
            },
            {
              height: 900,
              width: 1200
            }
          ],
          penthouse: {
            blockJSRequests: false,
          },
          include: [
          ]
        })
      );
    }
  }
};