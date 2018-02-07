'use strict'

exports.hello = function hello( ctx ) {
    ctx.app.emit( 'info', 'hello 1 from api::hello' );
    console.log( 'hello 2 from api::hello' );
    ctx.response.body = 'Hello World'
    throw new Error( 'excepiton from api::hello' )
}

exports.friends = function getFriends( ctx, next ) {
    ctx.body = [
        { 'name': '1', avater: '1.jpg' },
        { 'name': '2', avater: '2.jpg' }
    ];

    // allowed methods middleware
    // return next();
}

exports.saveChatMessage = function saveChatMessage( ctx, next ) {
    // ctx.body = [
    //     { 'name': '1', avater: '1.jpg' },
    //     { 'name': '2', avater: '2.jpg' }
    // ];

    let message = ctx.request.fields && ctx.request.fields[ 'message' ];

    return delay( 1500 ).then( () => {
        ctx.body = {
            user: {
                'name': '1', avater: '1.jpg'
            },
            reply: `你说的是：${message}`
        };
    } )
}

function delay( interval ) {
    return new Promise( resolve => {
        setTimeout( resolve, interval )
    } )
}