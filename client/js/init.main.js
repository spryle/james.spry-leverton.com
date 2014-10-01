/**
 * @jsx React.DOM
 */
var Fluxxor = require('fluxxor');
var Keyboard = require('./contrib/keyboard.js');
var React = require('react');
var stores = require('./stores');
var actions = require('./actions');
var ready = require('./ready');

var flux = new Fluxxor.Flux(stores, actions);

var keyboard = new Keyboard({
  'esc': 'esc',
  'left': 'left',
  'right': 'right',
  'tab': 'tab',
}, {
  'up up down down left right left right b a enter': 'konami'
}).start();

ready('title', function() {

  var Title = require('./components/title');
  var mount = document.getElementById('b-title-mount');

  return mount ? React.renderComponent(
    <Title flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});

ready('sidebar-tab', function() {

  var SidebarTab = require('./components/sidebar-tab');
  var mount = document.getElementById('b-sidebar-tab-mount');

  return mount ? React.renderComponent(
    <SidebarTab flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});

ready('sidebar-header', function() {

  var SidebarHeader = require('./components/sidebar-header');
  mount = document.getElementById('b-sidebar-header-mount');

  return mount ? React.renderComponent(
    <SidebarHeader flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});

ready('directory', function() {

  var Directory = require('./components/directory');
  var mount = document.getElementById('b-directory-mount');

  return mount ? React.renderComponent(
    <Directory flux={flux} keyboard={keyboard} />,
     mount
  ) : null;

});


ready('article', function() {

  var Article = require('./components/article');
  var mount = document.getElementById('b-article-mount');

  return mount ? React.renderComponent(
    <Article flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});


ready('asides', function() {

  var Aside = require('./components/aside');
  var mount = document.getElementById('b-aside-mount');

  return mount ? React.renderComponent(
    <Aside flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});


ready('progress', function() {

  var Progress = require('./components/progress');
  var mount = document.getElementById('b-progress-mount');

  return mount ? React.renderComponent(
    <Progress flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});

ready('router', function() {

  var site = flux.store('site');

  site.router.history.start({
    pushState: true,
    hashChange: true,
    silent: true
  });

  site.router.route('*notFound', '*', function(path) {
    flux.actions.path.change(window.location.pathname);
  });

  document.body.addEventListener('click', _.bind(function(event) {
    var elements = [];
    var node = event.target;
    while (node) {
      elements.unshift(node.localName);
      node = node.parentNode;
    }
    if (_.indexOf(elements, 'a') >= 0) {
      var href = event.target.getAttribute('href');
      if (!_.isNull(href) && !RegExp('^/').test(href)) {return;}
      flux.actions.path.change(href || '/');
      event.preventDefault();
      event.stopPropagation();
    }
  }, this));
  return true;

});

ready('ready', function() {
  var addClass = require('./contrib/el/add-class');
  addClass(document.documentElement, 'is-ready');
  return true;
});


ready('wallpaper', function() {

  var Wallpaper = require('./components/wallpaper');
  var mount = document.getElementById('b-wallpaper-mount');

  return mount ? React.renderComponent(
    <Wallpaper flux={flux} keyboard={keyboard} />,
    mount
  ) : null;

});

ready('analytics', function() {
  if (!window.ga) {return;}
  window.ga('create', 'UA-16542189-4', 'auto');
  window.ga('send', 'pageview');
  return true;
});
