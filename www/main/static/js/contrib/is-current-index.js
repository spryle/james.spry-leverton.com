var _ = require('underscore');

module.exports = function(path) {
  return (
    _.initial(window.location.pathname.split('/')).join('/') + '/' === path);

};
