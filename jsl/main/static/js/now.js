var _ = require('underscore');

module.exports = function(id, func) {
  func.id = id;
  var wrappers = _.rest(arguments, 1);
  _.each(wrappers, function(wrapper) {
    func = _.wrap(func, wrapper, id);
    func.id = id;
  });
  return func();
};
