var _ = require('underscore');
var warn = _.partial(console.warn, '[Warn]');
var error = _.partial(console.error, '[Error]');
var ready =  _.partial(console.info, '[Ready]');

module.exports = function(func) {
  var start = new Date();
  var result = func();
  var end = new Date();
  var time = (end - start) + 'ms';
  var args = func.id.split('__');
  args.push(time, result);
  if (result && _.isString(result)) {
    warn.apply(console, args);
  } else if (result && _.isObject(result) && result instanceof Error) {
    error.apply(console, args);
  } else {
    ready.apply(console, args);
  }
  return result;
};
