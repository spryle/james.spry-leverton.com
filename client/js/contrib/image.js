var settings = require('../settings');


module.exports = function(path, options) {
  if (!settings.MEDIA_URL) {throw 'MEDIA_URL is required.';}
  var params = _.map(options, function(option, key) {
    return key + '=' + option;
  }).join('&');
  return (
    settings.MEDIA_URL + path + '?' + params
  );
};
