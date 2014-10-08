var ArticleStore = require('./stores/article');
var DirectoryStore = require('./stores/directory');
var SiteStore = require('./stores/site');
var WallpaperStore = require('./stores/wallpaper');
var data = require('data');

var article = _.extend({
  status_code: 200,
  path: window.location.pathname
}, data.page);

var directory = _.extend({
  status_code: 200
}, data.index);

var site = {
  status: 'WAITING',
};

var wallpaper = {
  size: 30,
  frequency: 55,
  frameLength: 1000 / 4,
  numX: parseInt(window.screen.width * 1.05 / 30, 10),
  numY: parseInt(window.screen.height * 1.05 / 30, 10)
};

module.exports = {
  site: new SiteStore(site),
  article: new ArticleStore(article),
  directory: new DirectoryStore(directory),
  wallpaper: new WallpaperStore(wallpaper)
};

