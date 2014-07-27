var _ = require('underscore');
var Model = require('ampersand-model');
var Nodes = require('../collections/nodes');
var isCurrentPage = require('../contrib/is-current-page');


var Node = Model.extend({

  props: {
    is_file: 'boolean',
    is_directory: 'boolean',
    name: 'string',
    path: 'string',
    slug: 'string'
  },

  idAttribute: 'path',

  derived: {
    isCurrentPage: {
      deps: ['path'],
      fn: function () {
        return isCurrentPage(this.path);
      },
      cache: false
    }
  },

});

module.exports = Node;