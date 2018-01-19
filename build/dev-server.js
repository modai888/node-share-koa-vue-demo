const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const devConfig = require('./webpack.dev-compact.conf')
const config = require('../config')


module.exports = function devServer() {
    const compiler = webpack(devConfig);
    const fn = middleware(compiler, {
        publicPath: config.dev.assetsPublicPath,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    });

    return function webpackMiddleware(ctx, next) {
        ctx.res.statusCode = null;
        return fn(ctx.req, ctx.res, next);
    }
}