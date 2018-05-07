'use strict';

const fs = require('fs');
const path = require('path');

const realPath = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(realPath, relativePath);

module.exports = {
    realPath,
    resolveApp,
    get buildPath() {
      return resolveApp('dist');
    },
    get srcPath() {
      return resolveApp('src');
    },
    get nodeModulesPath() {
      return resolveApp('node_modules');
    },
    get publishPath() {
        return '/uos-manager/antd-ui/';
    },
    get prodBuildPath() {
        return resolveApp('../antd-ui');
    },
    get prodIndexPath() {
        return resolveApp('../');
    }

}