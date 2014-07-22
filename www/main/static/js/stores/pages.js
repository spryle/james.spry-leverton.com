var _ = require('underscore');
var Store = require('./store');
var PagesCollection = require('../collections/pages.js');
var constants = require('../constants');

var Pages = Store.extend({

  initialize: function() {
    _.bindAll(this, 'response', 'error', 'success');
  },

  encapsulate: function(data) {
    return new PagesCollection(data);
  },

  actions: _.invert({
    index: constants.ACTIONS.INDEX_CHANGE,
    page: constants.ACTIONS.PAGE_CHANGE
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
    var path = payload.path + 'index';
    var page = this.state.get(path);
    if (page && page.status_code === 200) {return false;}
    this.state.add({path: path}).fetch({
      success: this.success,
      error: this.error
    });
    return false;
  },

  page: function(payload) {
    var page = this.state.get(payload.path);
    if (page && page.status_code === 200) {return true;}
    this.state.add({path: payload.path}).fetch({
      success: this.success,
      error: this.error
    });
    return false;
  }

});

module.exports = Pages;
