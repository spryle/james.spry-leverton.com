var _ = require('underscore');
var Fluxxor = require('fluxxor');
var SiteState = require('../models/site.js');
var constants = require('../constants');


var actions = {};
actions[constants.ACTIONS.PATH_CHANGE] = 'loading';
actions[constants.ACTIONS.ARTICLE_LOADED] = 'updated';
actions[constants.ACTIONS.ARTICLE_FAILED] = 'updated';
actions[constants.ACTIONS.SITE_WAITING] = 'waiting';


module.exports = Fluxxor.createStore({

  initialize: function(initial) {
    this.state = new SiteState(initial);
  },

  actions: actions,

  loading: function(payload) {
    this.state.status = 'LOADING';
    this.emit('change');
  },

  updated: function(payload) {
    this.state.status = 'UPDATED';
    _.delay(this.flux.actions.site.waiting, 200);
    this.emit('change');
  },

  waiting: function(payload) {
    this.state.status = 'WAITING';
    this.emit('change');
  }

});
