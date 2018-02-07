const StreamInjecter = require('stream-injecter');
const reload = require('./lib/reload')

module.exports = livereload;

function livereload(koaApp, opts) {
    opts = opts || {};
    const port = koaApp.port || 4848;
    const src = "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
    const snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";

    const ret = reload(35729, opts.verboseLogging);

    return (ctx, next) => {
        if ( ctx.url.indexOf('livereload.js') > -1 ) {
            ctx.type = 'text/javascript'
            ctx.body = ret.reloadCode
            return;
        }

        return next().then(() => {
            if ( ctx.response.type && !ctx.response.type.includes('html') ) return;

            if ( opts.excludes ) {
                let path = ctx.path;
                if ( opts.excludes.some(exclude => path.startsWith(exclude)) ) return;
            }

            // Buffer
            if ( Buffer.isBuffer(ctx.body) ) {
                ctx.body = ctx.body.toString();
            }

            // string
            if ( typeof ctx.body === 'string' ) {
                if ( ctx.body.match(/livereload.js/) ) return;
                ctx.body = ctx.body.replace(/<\/body>/, snippet + "<\/body>");
            }

            // stream
            if ( ctx.body && typeof ctx.body.pipe === 'function' ) {
                let injecter = new StreamInjecter({
                    matchRegExp: /(<\/body>)/,
                    inject: snippet,
                    replace: snippet + "$1",
                    ignore: /livereload.js/
                });
                let size = +ctx.response.header[ 'content-length' ];

                if ( size ) ctx.set('Content-Length', size + snippet.length);
                ctx.body = ctx.body.pipe(injecter);
            }
        });
    }
}
