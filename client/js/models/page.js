var Model = require('ampersand-model');
var Asides = require('../collections/asides');
var Scheme = require('./scheme');
var isCurrentPage = require('../contrib/is-current-page');
var settings = require('settings');


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
    date_added_formatted: 'string',
    date_modified: 'date',
    date_modified_formatted: 'string',
    positions: 'object',
    display_footer: ['boolean', false, false]
  },

  session: {
    status_code: 'integer',
    status_message: 'string'
  },

  idAttribute: 'path',

  urlRoot: '//' + settings.API_ROOT,

  url: function() {
    return this.urlRoot + this.path;
  },

  derived: {
    is_current_page: {
      deps: ['path'],
      fn: function () {
        return isCurrentPage(this.path);
      },
      cache: false
    }
  },

  children: {
    scheme: Scheme
  },

  collections: {
    asides: Asides
  }


});

module.exports = Page;
