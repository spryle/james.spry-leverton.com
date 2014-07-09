var $ = require('jquery');

var data = require('./data.js');

var wallpaper = require('./wallpaper/wallpaper');
var article = require('./article/article');
var aside = require('./aside/aside');

var $pusher = $('.l-pusher');

$('[data-sidebar="toggle"]').on('click', function() {
  $pusher.toggleClass('is-pushed');
});

window.wallpaper = wallpaper($('.b-wallpaper')).render();
window.article = article($('.b-article-body'));
window.aside = aside($('.b-aside'), _.extend({}, {article: window.article}, data));
