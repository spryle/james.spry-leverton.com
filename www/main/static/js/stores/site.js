var _ = require('underscore');
var Store = require('./store');
var SiteState = require('../models/site.js');
var constants = require('../constants');


var Site = Store.extend({

  initialize: function() {
    _.bindAll(this, 'waiting');
  },

  encapsulate: function(data) {
    return new SiteState(data);
  },

  actions: _.invert({
    loading: constants.ACTIONS.PAGE_CHANGE,
    updated: constants.ACTIONS.PAGE_UPDATE
  }),

  loading: function(payload) {
    this.state.status = 'LOADING';
    return true;
  },

  updated: function(payload) {
    this.state.status = 'UPDATED';
    _.delay(this.waiting, 300);
    return true;
  },

  waiting: function(payload) {
    this.state.status = 'WAITING';
    this.commit();
  }


});

module.exports = Site;
