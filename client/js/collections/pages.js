var Page = require('../models/page.js');
var Collection = require('ampersand-collection');
var UnderscoreMixin = require('ampersand-collection-underscore-mixin');


var Pages = Collection.extend(UnderscoreMixin, {

  mainIndex: 'path',
  model: Page,

  getCurrentPage: function() {
    return this.findWhere({is_current_page: true});
  }

});

module.exports = Pages;
