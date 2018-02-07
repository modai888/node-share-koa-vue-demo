const axios = require( 'axios' );

module.exports.sendChatMessage = function sendChatMessage( message, user ) {
    return axios.post( '/api/chats', {
        message, user
    } )
}
