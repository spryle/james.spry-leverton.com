var _ = require('underscore');
var Store = require('./store');
var IndexesCollection = require('../collections/indexes');
var constants = require('../constants');


var Indexes = Store.extend({

  encapsulate: function(data) {
    return new IndexesCollection(data);
  },

  actions: _.invert({
    index: constants.ACTIONS.INDEX_CHANGE
  }),

  index: function(payload) {
    if (!this.state.get(payload.path)) {
      this.state.add({path: payload.path}).fetch({
        success: this.commit
      });
      return false;
    }
    return true;
  }

});

module.exports = Indexes;
