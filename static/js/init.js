var $ = require('jquery');

var $pusher = $('.l-pusher');

$('[data-sidebar="toggle"]').on('click', function() {
  $pusher.toggleClass('is-pushed');
});

window.wallpaper = require('./wallpaper/wallpaper.js');
wallpaper.start();
