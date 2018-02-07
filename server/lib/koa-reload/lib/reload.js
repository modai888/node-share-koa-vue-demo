const path = require('path')
const fs = require('fs')
const RELOAD_FILE = path.join(__dirname, './reload-client.js')

module.exports = function reload(httpServer, verboseLogging) {
    let reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8')

    let conn, wss, specifiedPort = null;

    const WebSocketServer = require('ws').Server
    if ( typeof httpServer === 'object' ) {
        wss = new WebSocketServer({ server: httpServer })
    } else {
        specifiedPort = httpServer;
        wss = new WebSocketServer({ port: httpServer })
    }
    // const wss = new WebSocketServer({ server: httpServer })
    //const wss = new WebSocketServer({ port: httpServer })

    wss.on('connection', (ws) => {
        // Take the current web socket connection and save it to webSocketConnetion so we can use it later in the returned reload function for manually firing reload events.
        conn = ws

        if ( verboseLogging ) {
            console.log('Reload client connected to server')
        }
    })

    if ( verboseLogging ) {
        reloadCode = reloadCode.replace('verboseLogging = false', 'verboseLogging = true')
    }

    reloadCode = reloadCode.replace(
        'window.location.origin.replace(/^http(s?):\\/\\//, \'ws$1://\')',
        'window.location.origin.replace(/(^http(s?):\\/\\/)(.*:)(.*)/,' + (specifiedPort ? '\'ws$2://$3' + specifiedPort : '\'ws$2://$3$4') + '\')'
    )

    // if ( specifiedPort ) {
    //     // reloadCode.replace('socketUrl.replace()', 'socketUrl.replace(/(^http(s?):\\/\\/)(.*:)(.*)/,' + (specifiedPort ? '\'ws$2://$3' + socketPortSpecified : '\'ws$2://$3$4') + '\')')
    //     reloadCode.replace('window.location.origin.replace(/^http(s?):\\/\\//, \'ws$1://\')',
    //         'sockewindow.location.origin.replace(/(^http(s?):\\/\\/)(.*:)(.*)/,' + (specifiedPort ? '\'ws$2://$3' + specifiedPort : '\'ws$2://$3$4') + '\')')
    // }

    // router.get('/reload/reload.js', (ctx, next) => {
    //   ctx.type = 'text/javascript'
    //   ctx.body = reloadCode
    // })

    // Return an object, so that the user can manually reload the server by calling the returned function reload. Using the web socket connection from above, we provide a function called reload which passes the command 'reload' to the function sendMessage. sendMessage sends the message 'reload' over the socket (if the socket is connected) to the client. The client then recieves the messages checks to see if the message is reload and then reloads the page.
    return {
        'reloadCode': reloadCode,
        'server': reload,
        'connection': conn,
        'reload': function () {
            this.sendMessage('reload')
        },
        'sendMessage': function (command) {
            if ( conn ) {
                conn.send(command, function (error) {
                    if ( error ) {
                        console.error(error)
                    }
                })
            } else {
                if ( verboseLogging ) {
                    console.log('Cannot send "' + command + '" to client: still not connected')
                }
            }
        }
    }
}
