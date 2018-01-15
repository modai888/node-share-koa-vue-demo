// helpers

// 解析启动参数
exports.simpleParseArgv = function simpleParseArgv(argv, defaultPort) {
    const reg = /^-{1,2}([a-z]+)$/i;
    let len = argv.length;

    let ret = {};
    for ( let i = 0; i < len; i++ ) {
        let arg = argv[ i ];

        if ( reg.test(arg) ) {
            let prop = RegExp.$1;
            ret[ prop ] = true;
            if ( argv[ i + 1 ] && !reg.test(argv[ i + 1 ]) ) {
                ret[ prop ] = argv[ ++i ];
            }
        }
    }
    return ret;
}

// 获取对象属性值
exports.getProp = function getParam(params, prop, convert, defaultVal) {
    if ( params[ prop ] ) {
        let corvertedVal = convert.call(null, params[ prop ]);
        return corvertedVal === undefined ? defaultVal : corvertedVal;
    }
    return defaultVal;
}