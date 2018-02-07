const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const devConfig = require('./webpack.dev-compact.conf')
const liveReload = require('../server/lib/koa-reload')
const config = require('../config')
const compose = require('koa-compose')

// entry: support hot
let entry = {}
if ( typeof devConfig.entry === 'object' ) {
    Object.keys(devConfig.entry).forEach(key => {
        let val = devConfig.entry[ key ];
        val = Array.isArray(val) ? val : [ val ];
        val.push('webpack-hot-middleware/client?reload=true')
        // val.push('koa-reload/lib/reload-client')
        entry[ key ] = val;
    })
}
devConfig.entry = entry;

module.exports = function devServer(opt) {
    opt = opt || {};
    const compiler = webpack(devConfig);

    return compose([
        liveReload(opt.app, opt),
        koaWebpackDevMiddleware(compiler, {
            publicPath: config.dev.assetsPublicPath,
            quiet: true, // necessary for FriendlyErrorsPlugin
            watchOptions: {
                poll: config.dev.poll,
            },
            stats: {
                colors: true
            }
        }),
        koaWebpackHotMiddleware(compiler)
    ])
}

function koaWebpackDevMiddleware(compiler, options) {
    const fn = webpackDevMiddleware(compiler, options);

    return function koaWebpackDevMiddleware(ctx, next) {
        // ctx.res.statusCode = null;
        return fn(ctx.req, {
            end: (content) => {
                ctx.body = content;
            },
            setHeader: ctx.set.bind(ctx),
            locals: ctx.state
        }, next);
    }
}

function koaWebpackHotMiddleware(compiler, options) {
    options = options || {};
    const fn = webpackHotMiddleware(compiler, options);

    return function koaWebpackHotMiddleware(ctx, next) {
        if ( ctx.originalUrl === (options.path || '/__webpack_hmr') ) {
            ctx.status = 200;
            ctx.respond = false;
        }
        return fn(ctx.req, ctx.res, next);
    }
}