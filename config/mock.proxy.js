'use strict';

const fs = require('fs');
const assert = require('assert');
const chokidar = require('chokidar');
const paths = require('./paths');
const chalk = require('chalk');
const _ = require('lodash');

const CONFIG_FILE = '.mock.js';

let mockData = {mockItems:[]};



function getConfig(filePath) {
    const resolvedFilePath = paths.resolveApp(filePath);
    if (fs.existsSync(resolvedFilePath)) {
        const files = [];
        const realRequire = require.extensions['.js'];
        require.extensions['.js'] = (m, filename) => {
            if (filename.indexOf(paths.nodeModulesPath) === -1) {
                files.push(filename);
            }
            delete require.cache[filename];
            return realRequire(m, filename);
        };

        const config = require(resolvedFilePath); // eslint-disable-line
        require.extensions['.js'] = realRequire;

        return {
            config,
            files
        };
    } else {
        return {
            config: {},
            files: [resolvedFilePath],
        };
    }
}

function parseKey(key) {
    let method = 'get';
    let path = key;

    if (key.indexOf(' ') > -1) {
        const splited = key.split(' ');
        method = splited[0].toLowerCase();
        path = splited[1];
    }

    return {
        method,
        path
    };
}

class MockItem {

    constructor(key, content) {
        this.keyParsed = parseKey(key);
        this.content = content;
        this.type = typeof content;

        let path = this.keyParsed.path;
        if (/\(.+\)/.test(this.keyParsed.path)) {
            path = new RegExp(`^${this.keyParsed.path}$`);
            this.isRegExp = true;
        }
        this.path = path;
    }

    match(method, path) {

        if (method !== '*' && this.keyParsed.method !== '*' && method != null && this.keyParsed.method !== method.toLowerCase()) {
            return false;
        }

        if (this.isRegExp) {
            return this.path.test(path);
        }

        return this.path == path || (path != null && path.startsWith(this.path + '?'));
    }

    mock(type, typeArg, req, res) {

        if (this.type === 'function') {
            return this.content(type, typeArg, req, res);
        }
        return this.content;
    }
}

function applyMock() {
    const fileContent = getConfig(CONFIG_FILE);
    const newMockData = [];
    if (fileContent && fileContent.config) {
        Object.keys(fileContent.config).forEach(key => {

            newMockData.push(new MockItem(key, fileContent.config[key]));

        });
    }
    mockData.mockItems = newMockData;
    const watcher = chokidar.watch(paths.resolveApp(CONFIG_FILE), {
        ignored: /node_modules/,
        persistent: true,
    });
    
    watcher.on('change', path => {
        console.log(chalk.green('CHANGED'), path.replace(paths.realPath, '.'));
        watcher.close();
        applyMock();
    });
}

applyMock();

function mock(proxyRes, req, res) {

    let m = _.find(mockData.mockItems, x => x.match(req.method, req.url));
    if (m != null) {
        
        if (m.type === 'function') {
            m.mock('proxy', proxyRes, req, res);
            
        } else {
            if(proxyRes.statusCode!=200){
                /* res.status(200);
                res.setHeader('content-type', 'application/json;charset=UTF-8');
                res.end(m.mock('proxy', proxyRes, req, res)); */
                proxyRes.pipe(res);
            }else{
                res.status(200);
                res.setHeader('content-type', typeArg.headers['content-type']);
                let body = new Buffer('');
                proxyRes.on('data', function (data) {
                    
                    body = Buffer.concat([body, data]);
                });
                proxyRes.on('end', function () {
                    body = body.toString();
                    
                    if (body == 'null'||body == '') {
                        body = m.mock('proxy', proxyRes, req, res);

                    }
                    //if(typeof(body)=='object'){
                    res.json(body);
                    //}
                    //else{
                    //    res.send(body);
                    //}
                    
                    res.end();
                    //console.log("res from proxied server:", body);
                    //res.end("my response to cli");
                });
            }
            
        }

    } else {
        proxyRes.pipe(res);
    }

    //req.url req.method
}

function mockError(err, req, res) {
    /* res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.'); */
    let m = _.find(mockData.mockItems, x => x.match(req.method, req.url));
    if (m != null) {
        if (m.type === 'function') {
            m.mock('error', err, req, res);
            
        } else {
            /* let body = m.mock('error', err, req, res);
            if (typeof body == 'string') {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
            } */
            let body = m.mock('error', err, req, res);
            res.end(body);
        }
        
        
    }
}

module.exports = {
    mock,
    mockError
};