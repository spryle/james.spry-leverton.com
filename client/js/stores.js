var ArticleStore = require('./stores/article');
var DirectoryStore = require('./stores/directory');
var SiteStore = require('./stores/site');
var WallpaperStore = require('./stores/wallpaper');
var wallpaper = require('./wallpaper/wallpaper');
var data = require('./data');

var content = document.getElementById('b-article-content');

var article = _.extend({
  status_code: 200,
  path: window.location.pathname,
  content: content ? content.innerHTML : ''
}, data.page);

var directory = _.extend({
  status_code: 200
}, data.index);

var site = {
  status: 'WAITING',
  history: {
    pushState: true,
    hashChange: true,
    silent: true
  }
};

var wallpaper = wallpaper({});

module.exports = {
  SiteStore: new SiteStore(site),
  ArticleStore: new ArticleStore(article),
  DirectoryStore: new DirectoryStore(directory),
  WallpaperStore: new WallpaperStore(wallpaper)
};
