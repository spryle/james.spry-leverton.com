var State = require('ampersand-state');
var Asides = require('../collections/asides');


var Page = State.extend({

  props: {
    name: 'string',
    path: 'string',
    author: 'string',
    title: 'string',
    content: 'string',
    tags: 'array',
    date_added: 'date',
    date_modified: 'date',
    positions: 'object'
  },

  derived: {
    isCurrentPage: {
      deps: ['path'],
      fn: function () {
        return window.location.pathname === this.path;
      },
      cache: false
    }

  },

  collections: {
    asides: Asides
  }

});

module.exports = Page;
