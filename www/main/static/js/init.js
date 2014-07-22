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
var Indexes = require('./stores/indexes');
var Site = require('./stores/site');

ready = _.partial(ready, _, _, false, report, expose);

var site = new Site({
  status: 'WAITING'
});

var indexes = new Indexes(_.extend({
  status_code: 200
}, data.index));

var content = document.getElementById('b-article-content');

var pages = new Pages(_.extend({
  status_code: 200,
  path: window.location.pathname,
  content: content ? content.innerHTML : ''
}, data.page));

ready('title', function() {

  var Title = require('./components/title');

  function render() {
    var page = pages.state.getCurrentPage();
    var index = indexes.state.getCurrentIndex();
    return React.renderComponent(
      <Title title={page && page.name ? page.name : index.name}/>,
      document.getElementById('b-title-mount')
    );
  }
  indexes.on('commit', render);
  pages.on('commit', render);
  return render();
});


ready('sidebar-tab', function() {

  var SidebarTab = require('./components/sidebar-tab');

  function render() {
    return React.renderComponent(
      <SidebarTab/>,
      document.getElementById('b-sidebar-tab-mount')
    );
  }

  return render();

});

ready('sidebar-header', function() {

  var SidebarHeader = require('./components/sidebar-header');

  function render() {
    var index = indexes.state.getCurrentIndex();
    if (!index) {return false;}
    return React.renderComponent(
      <SidebarHeader index={index} />,
      document.getElementById('b-sidebar-header-mount')
    );
  }

  indexes.on('commit', render);
  return render();
});

ready('directory', function() {

  var Directory = require('./components/directory');

  function render() {
    var index = indexes.state.getCurrentIndex();
    if (!index) {return false;}
    return React.renderComponent(
      <Directory index={index} />,
      document.getElementById('b-directory-mount')
    );
  }
  indexes.on('commit', render);
  pages.on('commit', render);
  return render();

});

ready('article', function() {

  var Article = require('./components/article');

  function render() {
    var page = pages.state.getCurrentPage();
    if (!page) {return false;}
    return React.renderComponent(
      <Article page={page} />,
      document.getElementById('b-article-mount')
    );
  }
  pages.on('commit', render);
  return render();

});

ready('asides', function() {

  var Aside = require('./components/aside');

  function render() {
    var page = pages.state.getCurrentPage();
    if (!page) {return false;}
    return React.renderComponent(
      <Aside page={page}/>,
      document.getElementById('b-aside-mount')
    );
  }

  pages.on('commit', render);
  return render(pages);
});

ready('wallpaper', function() {

  var Wallpaper = require('./components/wallpaper');

  function render() {
    return React.renderComponent(
      <Wallpaper />,
      document.getElementById('b-wallpaper-mount')
    );
  }

  return render();

});

ready('progress', function() {

  var Progress = require('./components/progress');

  function render() {
    return React.renderComponent(
      <Progress status={site.state.status}/>,
      document.getElementById('b-progress-mount')
    );
  }

  site.on('commit', render);
  return render();

});

ready('router', function() {

  var Router = require('./router');

  var router = new Router();

  router.history.start({
    pushState: true,
    hashChange: true,
    silent: true
  });

  document.body.addEventListener('click', function(event) {
    var elements = [];
    var node = event.target;
    while (node) {
      elements.unshift(node.localName);
      node = node.parentNode;
    }
    if (_.indexOf(elements, 'a') >= 0) {
      router.navigate(event.target.getAttribute('href'), true);
      event.preventDefault();
    }
  });

  return router;

});
