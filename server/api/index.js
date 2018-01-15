'use strict'

exports.hello = function hello(ctx) {
    ctx.response.body = 'Hello World'
    throw new Error('excepiton from api::hello')
}