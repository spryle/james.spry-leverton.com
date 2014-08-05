require('browsernizr/test/canvas');
require('browsernizr/lib/html5shiv');
require('browsernizr/lib/load');
require('browsernizr/lib/mq');

var Modernizr = require('browsernizr');
var settings = require('settings');

window.Modernizr = Modernizr;

Modernizr.load([{
  test: true,
  yep: settings.STATIC_URL + '/css/main.css'
}, {
  test: true,
  yep: settings.STATIC_URL + '/js/main.js'
}]);

