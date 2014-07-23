var _ = require('underscore');
var Router = require('ampersand-router');
var constants = require('./constants');


module.exports = Router.extend({

  initialize: function(options) {
    this.flux = options.flux;
  },

  routes: {
    '': 'change',
    '/': 'change',
    '(:filename)': 'change',
    '*path/': 'change',
    '*path/(:filename)': 'change',
  },

  watch: function() {
    document.body.addEventListener('click', _.bind(function(event) {
      var elements = [];
      var node = event.target;
      while (node) {
        elements.unshift(node.localName);
        node = node.parentNode;
      }
      if (_.indexOf(elements, 'a') >= 0) {
        this.navigate(event.target.getAttribute('href'), true);
        event.preventDefault();
      }
    }, this));
  },

  change: function (path, filename) {
    this.flux.actions.path.change(window.location.pathname);
  }

});
