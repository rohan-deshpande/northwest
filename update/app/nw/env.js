require('dotenv').config();

const ENV = process.env;
const NW_ENV = ENV.NW_ENV;
const __DEV__ = (NW_ENV === 'DEVELOPMENT');
const __PROD__ = (NW_ENV === 'PRODUCTION');
const __DEBUG__ = (NW_ENV === 'DEBUG');

if (__DEV__) {
    const NW_WATCHER = require('./nw/watcher.js');
    NW_WIN.showDevTools();
}
