'use strict';

module.exports = (pandora) => {

    pandora
        .cluster('./server/main.js')
        // 定义进程环境变量，创建出来的进程中可以通过 process.env 获得
        .env({
            NODE_ENV: 'development'
        });

    /**
     * you can custom workers scale number
     */
    // pandora
    //   .process('worker')
    //   .scale(2); // .scale('auto') means os.cpus().length

    /**
     * you can also use fork mode to start application
     */
    // pandora
    //   .fork('koa2-vue-demo', './server/main.js');

    /**
     * you can create another process here
     */
    // pandora
    //   .process('background')
    //   .nodeArgs(['--expose-gc']);

    /**
     * more features please visit our document.
     * https://github.com/midwayjs/pandora/
     */

};