var _ = require('underscore');
var Store = require('./store');
var IndexesCollection = require('../collections/indexes');
var constants = require('../constants');


var Indexes = Store.extend({

  initialize: function() {
    _.bindAll(this, 'response', 'error', 'success');
  },

  encapsulate: function(data) {
    return new IndexesCollection(data);
  },

  actions: _.invert({
    index: constants.ACTIONS.INDEX_CHANGE
  }),

  response: function(model, resp, options) {
    model.status_code = options.xhr.statusCode;
    model.status_message = options.xhr.statusMessage;
  },

  success: function(model, resp, options) {
    this.response(model, resp, options);
    this.commit();
  },

  error: function(model, resp, options) {
    this.response(model, resp, options);
    this.commit();
  },

  index: function(payload) {
    var index = this.state.get(payload.path);
    if (index && index.status_code === 200) {return true;}
    this.state.add({path: payload.path}).fetch({
      success: this.success,
      error: this.error
    });
    return false;
  }

});

module.exports = Indexes;
