'use strict'

exports.hello = function hello(ctx) {
    ctx.app.emit('info', 'hello 1 from api::hello');
    console.log('hello 2 from api::hello');
    ctx.response.body = 'Hello World'
    throw new Error('excepiton from api::hello')
}

exports.friends = function getFriends(ctx, next) {
    ctx.body = [
        { 'name': '1', avater: '1.jpg' },
        { 'name': '2', avater: '2.jpg' }
    ];

    // allowed methods middleware
    // return next();
}