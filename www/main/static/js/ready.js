var _ = require('underscore');
var report = require('./contrib/wrappers/report');
var expose = require('./contrib/wrappers/expose');
var start = require('./contrib/start');


module.exports = _.partial(start, _, _, false, report, expose);
