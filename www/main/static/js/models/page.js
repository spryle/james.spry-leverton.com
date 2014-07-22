var Model = require('ampersand-model');
var Asides = require('../collections/asides');
var isCurrentPage = require('../contrib/is-current-page');


var Page = Model.extend({

  props: {
    name: 'string',
    path: 'string',
    title: 'string',
    content: 'string',
    author: 'string',
    author_name: 'string',
    author_email: 'string',
    author_hash: 'string',
    tags: 'array',
    date_added: 'date',
    date_modified: 'date',
    positions: 'object'
  },

  session: {
    status_code: 'integer',
    status_message: 'string'
  },

  idAttribute: 'path',

  urlRoot: 'http://api.dev:5000',

  url: function() {
    return this.urlRoot + this.path;
  },

  derived: {
    isCurrentPage: {
      deps: ['path'],
      fn: function () {
        return isCurrentPage(this.path);
      },
      cache: false
    }
  },

  collections: {
    asides: Asides
  }

});

module.exports = Page;
