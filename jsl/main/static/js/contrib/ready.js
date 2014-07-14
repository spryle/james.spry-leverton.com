var ready = require('domready');
var _ = require('underscore');

module.exports = function(id, func, immediate) {
  func.id = id;
  var wrappers = _.rest(arguments, 3);
  _.each(wrappers, function(wrapper) {
    func = _.wrap(func, wrapper);
    func.id = id;
  });
  if (immediate) {
    return func();
  } else {
    return ready(func);
  }
};
