/**
 * @jsx React.DOM
 */
var Fluxxor = require('fluxxor');
var React = require('react');
var stores = require('./stores');
var actions = require('./actions');
var ready = require('./ready');

var flux = new Fluxxor.Flux(stores, actions);
window.flux = flux;


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

ready('wallpaper-debug-bar', function() {

  var WallpaperDebugBar = require('./components/wallpaper-debug-bar');

  return React.renderComponent(
    <WallpaperDebugBar flux={flux}/>,
    document.getElementById('b-wallpaper-debug-bar-mount')
  );

});

ready('progress', function() {

  var Progress = require('./components/progress');

  return React.renderComponent(
    <Progress flux={flux} />,
    document.getElementById('b-progress-mount')
  );

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

