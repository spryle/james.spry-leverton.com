/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');

var data = require('./contrib/data');
var report = require('./contrib/wrappers/report');
var expose = require('./contrib/wrappers/expose');
var ready = require('./contrib/ready');

ready = _.partial(ready, _, _, false, report, expose);

var Pages = require('./stores/pages');
var pages = new Pages(data.page);


ready('sidebar', function() {

  var sidebar = require('./components/sidebar');

  return sidebar.initialize(
    document.getElementsByClassName('b-sidebar-tab')[0],
    pages
  );

});

ready('article', function() {

  var Article = require('./components/article');

  function render() {
    var page = pages.state.getCurrentPage();
    React.renderComponent(
      <Article page={page} className='is-initialized' />,
      document.getElementsByClassName('b-middle-container')[0]
    );
  }

  // pages.on('change', render);
  // render();

});

ready('asides', function() {

  var AsideList = require('./components/asides');

  function render() {
    var page = pages.state.getCurrentPage();
    React.renderComponent(
      <AsideList page={page}/>,
      document.getElementsByClassName('b-aside')[0]
    );
  }

  pages.on('change', render);
  render();

});

ready('wallpaper', function() {

  var wallpaper = require('./wallpaper/wallpaper');

  return wallpaper.initialize(
    document.getElementsByClassName('b-wallpaper')[0]
  );

});

