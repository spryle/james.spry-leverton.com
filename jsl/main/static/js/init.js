var _ = require('underscore');

var data = require('./data');
var state = require('./state');
var report = require('./contrib/wrappers/report.js');
var expose = require('./contrib/wrappers/expose.js');
var ready = require('./ready');
var now = require('./now');

ready = _.partial(ready, _, _, report, expose);
now = _.partial(now, _, _, report, expose);


var page = new state.Page(data.page);


ready('sidebar-tab', function() {

  var tab = require('./sidebar/sidebar-tab');

  return tab.initialize(
    document.getElementsByClassName('b-sidebar-tab')[0],
    page
  );

});


ready('article-body', function() {

  var article = require('./article/article-body');

  return article.initialize(
    document.getElementsByClassName('b-article-body')[0],
    page
  );

});


ready('wallpaper', function() {

  var wallpaper = require('./wallpaper/wallpaper');

  return wallpaper.initialize(
    document.getElementsByClassName('b-wallpaper')[0],
    page
  );

});


ready('aside', function() {

  var aside = require('./aside/aside');

  return aside.initialize(
    document.getElementsByClassName('b-aside')[0],
    page
  );

});
