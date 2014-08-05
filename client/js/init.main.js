/**
 * @jsx React.DOM
 */
var Fluxxor = require('fluxxor');
var React = require('react');
var stores = require('./stores');
var actions = require('./actions');
var ready = require('./ready');

var flux = new Fluxxor.Flux(stores, actions);

if (window.Modernizr.mq('only screen and (max-width : 992px)')) {
  var removeClass = require('./contrib/el/remove-class');
  removeClass(document.body, 'is-pushed');
}

ready('title', function() {

  var Title = require('./components/title');
  var mount = document.getElementById('b-title-mount');

  return mount ? React.renderComponent(
    <Title flux={flux} />,
    mount
  ) : null;

});

ready('sidebar-tab', function() {

  var SidebarTab = require('./components/sidebar-tab');
  var mount = document.getElementById('b-sidebar-tab-mount');

  return mount ? React.renderComponent(
    <SidebarTab flux={flux} />,
    mount
  ) : null;

});

ready('sidebar-header', function() {

  var SidebarHeader = require('./components/sidebar-header');
  mount = document.getElementById('b-sidebar-header-mount');

  return mount ? React.renderComponent(
    <SidebarHeader flux={flux} />,
    mount
  ) : null;

});

ready('directory', function() {

  var Directory = require('./components/directory');
  var mount = document.getElementById('b-directory-mount');

  return mount ? React.renderComponent(
    <Directory flux={flux} />,
     mount
  ) : null;

});

ready('article', function() {

  var Article = require('./components/article');
  var mount = document.getElementById('b-article-mount');

  return mount ? React.renderComponent(
    <Article flux={flux} />,
    mount
  ) : null;


});

ready('asides', function() {

  var Aside = require('./components/aside');
  var mount = document.getElementById('b-aside-mount');

  return mount ? React.renderComponent(
    <Aside flux={flux}/>,
    mount
  ) : null;

});

ready('wallpaper', function() {

  var Wallpaper = require('./components/wallpaper');
  var mount = document.getElementById('b-wallpaper-mount');

  return mount ? React.renderComponent(
    <Wallpaper flux={flux}/>,
    mount
  ) : null;

});

ready('wallpaper-debug-bar', function() {

  var WallpaperDebugBar = require('./components/wallpaper-debug-bar');
  var mount = document.getElementById('b-wallpaper-debug-bar-mount');

  return mount ? React.renderComponent(
    <WallpaperDebugBar flux={flux}/>,
    mount
  ) : null;

});

ready('progress', function() {

  var Progress = require('./components/progress');
  var mount = document.getElementById('b-progress-mount');

  return mount ? React.renderComponent(
    <Progress flux={flux} />,
    mount
  ) : null;

});

ready('history', function() {
  return flux.store('site').router.route('*notFound', '*', function(path) {
    flux.actions.path.change(window.location.pathname);
  });
});

// ready('router', function() {

  // document.body.addEventListener('click', _.bind(function(event) {
  //   var elements = [];
  //   var node = event.target;
  //   while (node) {
  //     elements.unshift(node.localName);
  //     node = node.parentNode;
  //   }
  //   if (_.indexOf(elements, 'a') >= 0) {
  //     var href = event.target.getAttribute('href');
  //     if (!RegExp('^/').test(href)) {return;}
  //     flux.actions.path.change(href);
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }, this));
  // return true;

// });
