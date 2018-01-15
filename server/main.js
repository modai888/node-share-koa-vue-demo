// 应用程序入口
// 应用程序启动逻辑
const {
    simpleParseArgv,
    getProp
} = require('./utils/index')
const { info } = require('./utils/log')

const app = require('./app')


// parse launch's params
const params = simpleParseArgv(process.argv.slice(2));
const port = getProp(params, 'port', p => parseInt(p, 10), 5858);

// start-up our application
app.startApplication(port, () => {
    info('\x1b[32m应用程序启动完毕，端口号:%d\1b[0m', port);
});

