var data = require('./data.js');

var wallpaper = require('./wallpaper/wallpaper');
var article = require('./article/article');
var aside = require('./aside/aside');
var layout = require('./layout/layout');


window.layout = layout(
  document.getElementsByClassName('b-sidebar-tab')[0],
  {}
);

window.wallpaper = wallpaper(
  document.getElementsByClassName('b-wallpaper')[0],
  {}
).render();

window.article = article(
  document.getElementsByClassName('b-article-body')[0],
  {}
);
window.aside = aside(
  document.getElementsByClassName('b-aside')[0],
  _.extend({}, {article: window.article}, data)
);
