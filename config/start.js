'use strict';

const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const webpackConfig = require('./webpack.dev.conf.js');
const mock = require('./mock');
const httpProxy = require('http-proxy');
const httpProxyMiddleware = require('./http-proxy-middleware/index');

const devServerConfig = webpackConfig.devServer;
let basicProxyConfig = devServerConfig.proxy;
delete devServerConfig.proxy;


function compile() {
    let compiler;
    try {
        compiler = webpack(webpackConfig);
    } catch (err) {
        console.log(chalk.red('Failed to initialize compile.'));
        console.log(err.message || err);
        process.exit(1);
    }

    compiler.plugin('done', stats => {
        const messages = formatWebpackMessages(stats.toJson({}, true));

        if (!messages.errors.length && !messages.warnings.length) {
            console.log(chalk.green('Compile finished successfully!'));
        } else if (messages.errors.length) {
            console.log(chalk.red('Failed to compile.'));
            messages.errors.forEach(message => {
                console.log(message);
            });
        }
    });
    return compiler;
}

function run() {
    const compiler = compile();
    const devServer = new WebpackDevServer(compiler, devServerConfig);
    const app = devServer.app;

    if (basicProxyConfig) {

        if (!Array.isArray(basicProxyConfig)) {
            basicProxyConfig = Object.keys(basicProxyConfig).map((context) => {
                let proxyOptions;
                // For backwards compatibility reasons.
                const correctedContext = context.replace(/^\*$/, '**').replace(/\/\*$/, '');

                if (typeof basicProxyConfig[context] === 'string') {
                    proxyOptions = {
                        context: correctedContext,
                        target: basicProxyConfig[context]
                    };
                } else {
                    proxyOptions = Object.assign({}, basicProxyConfig[context]);
                    proxyOptions.context = correctedContext;
                }
                proxyOptions.logLevel = proxyOptions.logLevel || 'warn';

                return proxyOptions;
            });
        }
        const websocketProxies = [];
        const getProxyMiddleware = (proxyConfig) => {
            const context = proxyConfig.context || proxyConfig.path;

            // It is possible to use the `bypass` method without a `target`.
            // However, the proxy middleware has no use in this case, and will fail to instantiate.
            if (proxyConfig.target) {
                return httpProxyMiddleware(context, proxyConfig);
            }
        };
        basicProxyConfig.forEach((proxyConfigOrCallback) => {
            let proxyConfig;
            let proxyMiddleware;

            if (typeof proxyConfigOrCallback === 'function') {
                proxyConfig = proxyConfigOrCallback();
            } else {
                proxyConfig = proxyConfigOrCallback;
            }

            proxyMiddleware = getProxyMiddleware(proxyConfig);
            if (proxyConfig.ws) {
                websocketProxies.push(proxyMiddleware);
            }

            app.use(function myHttpProxyMiddleware(req, res, next){
                if (typeof proxyConfigOrCallback === 'function') {
                    const newProxyConfig = proxyConfigOrCallback();
                    if (newProxyConfig !== proxyConfig) {
                        proxyConfig = newProxyConfig;
                        proxyMiddleware = getProxyMiddleware(proxyConfig);
                    }
                }
                const bypass = typeof proxyConfig.bypass === 'function';
                // eslint-disable-next-line
                const bypassUrl = bypass && proxyConfig.bypass(req, res, proxyConfig) || false;

                if (bypassUrl) {
                    req.url = bypassUrl;
                    next();
                } else if (proxyMiddleware) {
                    return proxyMiddleware(req, res, next);
                } else {
                    next();
                }
            });
        });

    }

    mock(devServer);

    const basePort = Number(devServerConfig.port);
    portfinder
        .getPortPromise({
            port: basePort
        })
        .then(port => {
            // Will use devServerConfig.port if available, otherwise fall back to a random port
            devServer.listen(port, devServerConfig.host, err => {
                if (err) {
                    return console.log(chalk.red(err));
                }

                if (Number(port) !== Number(basePort)) {
                    console.log(
                        chalk.magenta(
                            `Port ${basePort} is occupied, assign new port ${port}.`
                        )
                    );
                }

                console.log(
                    `The app is running at: ${chalk.cyan(
              `http://${devServerConfig.host}:${port}/`
            )}`
                );
            });
        })
        .catch(err => {
            console.log(`No port available: ${chalk.red(err)}`);
        });
}

run();