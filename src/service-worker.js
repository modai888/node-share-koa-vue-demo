const self = this;

// 监听页面发送过来的消息
self.addEventListener('message', function (event) {
    var body = {
        body: event.data
    };
    // event.waitUntil(
    //     self.registration.showNotification('未读消息', body)
    // )
    console.log('接收到来自页面的消息：' + event.data)

    event.waitUntil(
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                console.log(client);
                client.postMessage('nihao')
            })
        })
    )
});

self.addEventListener('activate', function (event) {
    console.log(self)
    event.waitUntil(
        self.clients.claim()
    )
})