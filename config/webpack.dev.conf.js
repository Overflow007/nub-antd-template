'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlPlugin = require('html-webpack-plugin');
const os = require('os');
const path = require('path');
const _ = require('lodash');
const {mock,mockError} = require('./mock.proxy');
const baseWebpackConfig = require('./webpack.base.conf');
const { srcPath, buildPath, nodeModulesPath,resolveApp } = require('./paths');

const devWebpackConfig = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      './index',
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HappyPack({
        id: 'js',
        threads: os.cpus().length,
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [require.resolve('babel-preset-env'), { modules: false }],
                require.resolve('babel-preset-react'),
                require.resolve('babel-preset-stage-0'),
              ],
              plugins: [
                require.resolve('react-hot-loader/babel'),
                require.resolve('babel-plugin-transform-decorators-legacy'),
                [
                  require.resolve('babel-plugin-transform-runtime'),
                  {
                    helpers: false,
                    polyfill: false,
                    regenerator: true,
                    moduleName: path.dirname(
                      require.resolve('babel-runtime/package')
                    ),
                  },
                ],
              ],
            },
          },
        ],
      }),
      new HappyPack({
        id: 'css',
        threads: os.cpus().length,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            query: {
              config: path.resolve(__dirname, '.', 'postcss.config.js'),
            },
          },
        ],
      }),
      new HappyPack({
        id: 'sass',
        threads: os.cpus().length,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            query: {
              config: path.resolve(__dirname, '.', 'postcss.config.js'),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }),
      new HappyPack({
        id: 'less',
        threads: os.cpus().length,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            query: {
              config: path.resolve(__dirname, '.', 'postcss.config.js'),
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }),
      new HtmlPlugin({ template: './index.html' }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: 'happypack/loader?id=css',
        },
        {
          test: /\.(scss|sass)$/,
          use: 'happypack/loader?id=sass',
        },
        {
          test: /\.less$/,
          use: 'happypack/loader?id=less',
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
        },
        {
          test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&minetype=application/font-woff',
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&minetype=application/octet-stream',
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&minetype=image/svg+xml',
        },
        {
          test: /\.(jsx|js)?$/,
          use: 'happypack/loader?id=js',
          exclude: /node_modules/,
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: ['url-loader?limit=8192'],
          exclude: /node_modules/,
        },
        {
          test: /\.swf$/,
          use: 'file-loader?name=[name].[ext]',
        },
      ],
    },
    devServer: {
      host: '127.0.0.1',
      port: '8000',
      proxy: {},
      compress: true,
      contentBase: buildPath,
      clientLogLevel: 'none',
      disableHostCheck: true,
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      stats: {
        chunks: false,
        colors: true,
      },
      watchContentBase: true,
      watchOptions: {
        ignored: /node_modules/,
      },
      proxy: {
        '*': {
          target: 'http://101.132.66.16:9079/uos-manager',
          // target: 'http://127.0.0.1:8080/uos-manager',
          changeOrigin: true,
          selfHandleResponse:true,//现版本的webpack-dev-server所依赖的http-proxy-middleware依赖的http-proxy版本是0.16是不支持的，当是http-proxy升级到0.17就支持了
          secure: false,
          proxyTimeout:3000,
          timeout:3000,
          bypass: req => {
            
            var isOriginPages = false;///^\/(view|common)\/[^\.]+\.[^\.]+/.test(req.url);
            if (req.headers['x-requested-with'] === 'XMLHttpRequest'
            ||(req.url!=null&&(req.url.indexOf('.do')>-1
            ||req.url.indexOf('.qry')>-1))||isOriginPages)
            {
              console.log('try to proxy:',req.url);
              return false;
            }
            
              return req.originalUrl;
           
          }, 
          onError:(err, req, res)=>{
            console.log('onError');//,err, req, res);
            mockError(err, req, res);
          }, 
          onProxyRes:(proxyRes, req, res)=>{//response callback
            //console.log('onProxyRes');//,proxyRes, req, res);
            mock(proxyRes, req, res)
            
          }, 
          onProxyReq:(proxyReq, req, res)=>{//request callback
            //console.log('onProxyReq');//,proxyReq, req, res);
          }, 
          onProxyReqWs:(proxyReq, req, socket, options, head)=>{
            //console.log('onProxyReqWs');//,proxyReq, req, socket, options, head);
          }, 
          onOpen:(proxySocket)=>{
            //console.log('onOpen');//,proxySocket);
          }, 
          onClose:(res, socket, head)=>{
            //console.log('onClose');//,res, socket, head);
          }
        },
      },
    },
  };
  module.exports = _.merge({}, baseWebpackConfig, devWebpackConfig);