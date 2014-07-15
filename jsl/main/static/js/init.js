/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');

var data = require('./contrib/data');
var report = require('./contrib/wrappers/report');
var expose = require('./contrib/wrappers/expose');
var ready = require('./contrib/ready');

var Pages = require('./stores/pages');

ready = _.partial(ready, _, _, false, report, expose);

var content = document.getElementById('b-article-content');
var pages = new Pages(_.extend({
  path: window.location.pathname,
  content: content ? content.innerHTML : ''
}, data.page));
var page = pages.state.getCurrentPage();


ready('sidebar', function() {

  var SidebarTab = require('./components/sidebar-tab');

  function render() {
    React.renderComponent(
      <SidebarTab/>,
      document.getElementById('b-sidebar-tab-mount')
    );
  }

  render();

});

ready('article', function() {

  var Article = require('./components/article');

  function render(store) {
    React.renderComponent(
      <Article page={pages.state.getCurrentPage()} />,
      document.getElementById('b-article-mount')
    );
  }

  pages.on('change', render);
  render(pages);

});

ready('asides', function() {

  var Aside = require('./components/aside');

  function render(store) {
    React.renderComponent(
      <Aside page={store.state.getCurrentPage()}/>,
      document.getElementById('b-aside-mount')
    );
  }

  pages.on('commit', render, pages);
  render(pages);

});

ready('wallpaper', function() {

  var wallpaper = require('./wallpaper/wallpaper');

  return wallpaper.initialize(
    document.getElementsByClassName('b-wallpaper')[0]
  );

});

