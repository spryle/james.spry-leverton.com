var _ = require('underscore');
var Model = require('ampersand-model');
var Nodes = require('../collections/nodes');
var isCurrentIndex = require('../contrib/is-current-index');
var settings = require('settings');


var Index = Model.extend({

  props: {
    is_file: 'boolean',
    is_directory: 'boolean',
    name: 'string',
    path: 'string',
    slug: 'string',
    level: 'integer',
    parent: 'object'
  },

  session: {
    status_code: 'integer',
    status_message: 'string'
  },

  collections: {
    children: Nodes
  },

  idAttribute: 'path',

  urlRoot: '//' + settings.API_ROOT,

  url: function() {
    return this.urlRoot + this.path;
  },

  derived: {
    is_current_index: {
      deps: ['path'],
      fn: function () {
        return isCurrentIndex(this.path);
      },
      cache: false
    }
  }


});

module.exports = Index;
