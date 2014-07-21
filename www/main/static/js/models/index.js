var _ = require('underscore');
var Model = require('ampersand-model');
var Nodes = require('../collections/nodes');
var isCurrentIndex = require('../contrib/is-current-index');


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

  collections: {
    children: Nodes
  },

  idAttribute: 'path',

  urlRoot: 'http://api.dev:5000',

  url: function() {
    return this.urlRoot + this.path;
  },

  derived: {
    isCurrentIndex: {
      deps: ['path'],
      fn: function () {
        return isCurrentIndex(this.path);
      },
      cache: false
    }
  }

});

module.exports = Index;
