var Aside = require('../models/aside');
var Collection = require('ampersand-collection');
var UnderscoreMixin = require('ampersand-collection-underscore-mixin');


var Asides = Collection.extend(UnderscoreMixin, {

  mainIndex: 'target',
  model: Aside

});


module.exports = Asides;
