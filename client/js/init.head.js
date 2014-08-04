require('browsernizr/test/canvas');
require('browsernizr/lib/html5shiv');
require('browsernizr/lib/load');
var Modernizr = require('browsernizr');
var settings = require('settings');

Modernizr.load([{
  test: true,
  yep: settings.STATIC_URL + '/css/main.css'
}, {
  test: true,
  yep: settings.STATIC_URL + '/js/main.js'
}]);

