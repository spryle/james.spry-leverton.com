var settings = require('settings');

module.exports = function(func) {
  if (settings.DEBUG) {
    return func();
  } else {
    try {
      return func();
    } catch (error) {
      return error;
    }
  }
};
