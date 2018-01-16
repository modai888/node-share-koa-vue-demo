const Koa = require('koa')
const api = require('./api');

// exports our application
const app = new Koa()
exports = module.exports = app

// static server
function registerStaticServer() {

}

// entry
// + global error handling
async function entry(ctx, next) {
    try {
        await next();
        // next().then(()=>{}).catch((err)=>{throw err;})
    } catch ( err ) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message
        };
    }
}

// register configuration
function registerConfiguration() {
    const isProd = process.env.NODE_ENV === 'production';
    const config = require('./config/' + (isProd ? 'prod' : 'dev'));

    return async function (ctx, next) {
        ctx.$config = config;
        ctx.$isProduction = isProd;

        await next();
    }
}

// route apis
function registerApiRoutes() {
    app.use(api.hello);
}

// route pages

app.on('info', (msg)=>{
    console.log(msg)
})

exports.startApplication = function (port, callback) {
    registerStaticServer();

    app.use(entry);
    app.use(registerConfiguration());

    registerApiRoutes();

    app.listen(port, callback)
}
