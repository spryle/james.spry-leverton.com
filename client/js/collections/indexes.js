var Collection = require('ampersand-collection');
var UnderscoreMixin = require('ampersand-collection-underscore-mixin');
var Index = require('../models/index');


var Indexes = Collection.extend(UnderscoreMixin, {

  mainIndex: 'path',

  model: Index,

  getCurrentIndex: function() {
    return this.findWhere({is_current_index: true});
  }

});


module.exports = Indexes;
