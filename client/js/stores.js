var ArticleStore = require('./stores/article');
var DirectoryStore = require('./stores/directory');
var SiteStore = require('./stores/site');
var WallpaperStore = require('./stores/wallpaper');
var data = require('data');


var SIZE = 30;
var FREQUENCY = 55;
var STATUS_CODE = 200;
var INITIAL_STATUS = 'WAITING';

var article = _.extend({
  status_code: STATUS_CODE,
  path: window.location.pathname
}, data.page);

var directory = _.extend({
  status_code: STATUS_CODE
}, data.index);

var site = {
  status: INITIAL_STATUS,
};

var wallpaper = {
  size: SIZE,
  frequency: FREQUENCY,
  numX: parseInt(window.screen.width * 1.05 / SIZE, 10),
  numY: parseInt(window.screen.height * 1.05 / SIZE, 10)
};

module.exports = {
  site: new SiteStore(site),
  article: new ArticleStore(article),
  directory: new DirectoryStore(directory),
  wallpaper: new WallpaperStore(wallpaper)
};

