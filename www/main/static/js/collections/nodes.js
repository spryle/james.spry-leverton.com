var Collection = require('ampersand-collection');
var UnderscoreMixin = require('ampersand-collection-underscore-mixin');
var Node = require('../models/node');

var Nodes = Collection.extend(UnderscoreMixin, {

  mainIndex: 'path',

  model: Node,

});


module.exports = Nodes;
