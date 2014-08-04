var settings = require('settings');
var _ = require('underscore');


module.exports = function(path, options) {
  if (!settings.MEDIA_URL) {throw 'MEDIA_URL is required.';}
  var params = _.without(_.map(options, function(option, key) {
    if (_.isUndefined(option)) {return null;}
    return key + '=' + option;
  }), null).join('&');
  return (
    settings.MEDIA_URL + path + '?' + params
  );
};
