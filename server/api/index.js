'use strict'

exports.hello = function hello(ctx) {
    ctx.app.emit('info','hello 1 from api::hello');
    console.log('hello 2 from api::hello');
    ctx.response.body = 'Hello World'
    throw new Error('excepiton from api::hello')
}