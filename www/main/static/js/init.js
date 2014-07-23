/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var Fluxxor = require('fluxxor');
var React = require('react');
var data = require('./contrib/data');
var report = require('./contrib/wrappers/report');
var expose = require('./contrib/wrappers/expose');
var ready = require('./contrib/ready');
var constants = require('./constants');
var ArticleStore = require('./stores/article');
var DirectoryStore = require('./stores/directory');
var SiteStore = require('./stores/site');

ready = _.partial(ready, _, _, false, report, expose);

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
  status: 'WAITING'
};

var stores = {
  SiteStore: new SiteStore(site),
  ArticleStore: new ArticleStore(article),
  DirectoryStore: new DirectoryStore(directory),
};

var actions = {

  path: {

    change: function(path) {
      this.dispatch(constants.ACTIONS.PATH_CHANGE, path);
    }

  },

  article: {

    loaded: function(path) {
      this.dispatch(constants.ACTIONS.ARTICLE_LOADED, path);
    },

    failed: function(path) {
      this.dispatch(constants.ACTIONS.ARTICLE_FAILED, path);
    }

  },

  directory: {

    loaded: function(path) {
      this.dispatch(constants.ACTIONS.DIRECTORY_LOADED, path);
    },

    failed: function(path) {
      this.dispatch(constants.ACTIONS.ARTICLE_FAILED, path);
    }
  },

  site: {

    waiting: function() {
      this.dispatch(constants.ACTIONS.SITE_WAITING);
    }

  }

};

var flux = new Fluxxor.Flux(stores, actions);

ready('title', function() {

  var Title = require('./components/title');

  return React.renderComponent(
    <Title flux={flux} />,
    document.getElementById('b-title-mount')
  );

});

ready('sidebar-tab', function() {

  var SidebarTab = require('./components/sidebar-tab');

  return React.renderComponent(
    <SidebarTab flux={flux} />,
    document.getElementById('b-sidebar-tab-mount')
  );

});

ready('sidebar-header', function() {

  var SidebarHeader = require('./components/sidebar-header');

  return React.renderComponent(
    <SidebarHeader flux={flux} />,
    document.getElementById('b-sidebar-header-mount')
  );

});

ready('directory', function() {

  var Directory = require('./components/directory');

  return React.renderComponent(
    <Directory flux={flux} />,
    document.getElementById('b-directory-mount')
  );

});

ready('article', function() {

  var Article = require('./components/article');

  return React.renderComponent(
    <Article flux={flux} />,
    document.getElementById('b-article-mount')
  );


});

ready('asides', function() {

  var Aside = require('./components/aside');

  return React.renderComponent(
    <Aside flux={flux}/>,
    document.getElementById('b-aside-mount')
  );

});

ready('wallpaper', function() {

  var Wallpaper = require('./components/wallpaper');

  return React.renderComponent(
    <Wallpaper flux={flux}/>,
    document.getElementById('b-wallpaper-mount')
  );

});

ready('progress', function() {

  var Progress = require('./components/progress');

  return React.renderComponent(
    <Progress flux={flux} />,
    document.getElementById('b-progress-mount')
  );

});

ready('router', function() {

  var Router = require('./router');

  var router = new Router({flux: flux});

  router.watch();

  router.history.start({
    pushState: true,
    hashChange: true,
    silent: true
  });

  return router;

});

