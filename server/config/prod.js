'use strict';

const baseConfig = require('./base')

// TODO: 替换object.assign
module.exports = object.assign({}, baseConfig, {
    api: 'http://www.test.com/api'
});