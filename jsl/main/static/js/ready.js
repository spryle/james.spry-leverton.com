var ready = require('domready');
var _ = require('underscore');

module.exports = function(id, func) {
  func.id = id;
  var wrappers = _.rest(arguments, 2);
  _.each(wrappers, function(wrapper) {
    func = _.wrap(func, wrapper);
    func.id = id;
  });
  return ready(func);
};
