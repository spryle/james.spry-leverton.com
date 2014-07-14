var Store = require('./store');
var PagesCollection = require('../collections/pages.js');


var Pages = Store.extend({

  encapsulate: function(data) {
    return new PagesCollection(data);
  },

  actions: {
    'TEST': 'test'
  },

  test: function() {
    console.log(arguments);
  }

});

module.exports = Pages;
