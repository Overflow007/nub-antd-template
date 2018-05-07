'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlPlugin = require('html-webpack-plugin');
const glob = require('glob');
const os = require('os');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { srcPath, buildPath, nodeModulesPath } = require('./paths');

const files = glob.sync(srcPath+'/routes/*/index.js');
let newEntries = {'jquery':'jquery'};

console.log('=======generating ./src/routes/export.js=======');
let exportFn = '';
let str1 = '';
let str2 = '';
let index = 0;
files.forEach(function(f){
    let name = /.*\/(routes\/.*?\/index)\.js/.exec(f)[1];//得到routes/Home/index这样的文件名
  console.log(name,f);
  let nf = f.replace('./src','./');
  let tn = name//.replace("/","_");
  //newEntries[tn] = nf;
  str1 += ('import module'+index+' from \''+name+'\'\r\n');

  str2 += '\r\n  if(path=="'+name+'"){\r\n    return (async () =>  module'+index+')\r\n  }\r\n';
  index++;
  //newEntries.push(f);
});
exportFn+=str1;
exportFn+='\r\nfunction importPageComponent(path){\r\n';
exportFn+=str2;

exportFn += '  return (() => import("routes/PageNotFound/index"));}\r\nexport default importPageComponent;';
console.log('=======writing all exportable pages into ./src/routes/export.js=======');
fs.writeFileSync(srcPath+'/routes/export.js',exportFn)
console.log('=======writen=======');


module.exports = {
    context: srcPath,
    externals: {},
    entry:{'jquery':'jquery'},
    output: {
        path: buildPath,
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/',
        crossOriginLoading: 'anonymous',
    },
    resolve: {
        modules: ['node_modules', nodeModulesPath, srcPath],
        extensions: ['.js', '.json', '.jsx'],
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, '..', 'node_modules')],
    },
}