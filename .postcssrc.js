// https://github.com/michael-ciniawsky/postcss-load-config
const pkg = require('./package.json');

module.exports = {
    "plugins": {
        // to edit target browsers: use "browserslist" field in package.json
        "postcss-import": {},
        "postcss-url": {},
        "postcss-base64": {
            extension: [ '.svg' ]
        },
        "postcss-cssnext": {
            browsers: pkg.browserslist
        },
        "postcss-nesting": {}
    }
};
