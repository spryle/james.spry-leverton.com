require('browsernizr/test/canvas');
require('browsernizr/lib/html5shiv');
require('browsernizr/lib/mq');

var load = require('lazyloader');

var Modernizr = require('browsernizr');
var settings = require('settings');
var removeClass = require('./contrib/el/remove-class');

var LOAD_CSS = true;
var LOAD_JS = Modernizr.canvas;

if (Modernizr.mq('only screen and (max-width : 992px)')) {
  removeClass(document.documentElement, 'is-pushed');
}

var js = settings.STATIC_URL + 'js/main' + (
  settings.MINIFIED_STATIC ? '.min.gz.js' : '.js');
var css = settings.STATIC_URL + 'css/main' + (
  settings.MINIFIED_STATIC ? '.min.gz.css' : '.css');

if (LOAD_CSS) {load.css(css);}
if (LOAD_JS) {load.js(js);}
