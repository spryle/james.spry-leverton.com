var _ = require('underscore');
var report = require('./contrib/wrappers/report');
var expose = require('./contrib/wrappers/expose');
var except = require('./contrib/wrappers/except');
var start = require('./contrib/start');


module.exports = _.partial(start, _, _, false, except, report, expose);
