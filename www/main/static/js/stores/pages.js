var _ = require('underscore');
var Store = require('./store');
var PagesCollection = require('../collections/pages.js');
var constants = require('../constants');

var Pages = Store.extend({

  encapsulate: function(data) {
    return new PagesCollection(data);
  },

  actions: _.invert({
    index: constants.ACTIONS.INDEX_CHANGE,
    page: constants.ACTIONS.PAGE_CHANGE
  }),

  index: function(payload) {
    if (!this.state.get(payload.path + 'index')) {
      this.state.add({path: payload.path + 'index'}).fetch({
        success: this.commit
      });
    }
  },

  page: function(payload) {
    if (!this.state.get(payload.path)) {
      this.state.add({path: payload.path}).fetch({
        success: this.commit
      });
      return false;
    }
    return true;
  }

});

module.exports = Pages;
