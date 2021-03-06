'use strict';

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const { buildPath, srcPath } = require('./paths');
const webpackConfig = require('./webpack.prod.conf');

const callback = webpackConfig.callback;
delete webpackConfig.callback;

function build() {
    let compiler;
    try {
      compiler = webpack(webpackConfig);
    } catch (err) {
      console.log('Failed to initialize compile.', chalk.red(err));
      process.exit(1);
    }
  
    compiler.run((err, stats) => {
      if (err) {
        console.log('Failed to compile.', chalk.red(err));
        process.exit(1);
      } else if (stats.compilation.errors.length) {
        console.log('Failed to compile.', chalk.red(stats.compilation.errors));
        process.exit(1);
      }
  
      const outputOptions = {
        context: srcPath,
        colors: { level: 2, hasBasic: true, has256: true, has16m: false },
        chunks: true,
        children: false,
        performance: true,
      };
      process.stdout.write(stats.toString(outputOptions) + '\n');

      if(callback){
        callback();
      }
  
      console.log(chalk.green('Compiled successfully.'));
    });
  }
  
  // clear the build path folder first
  const deleteFolder = path => {
    let files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(file => {
        const curPath = path + '/' + file;
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          deleteFolder(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  
  deleteFolder(buildPath);
  
  build();
  