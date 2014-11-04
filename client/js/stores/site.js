var _ = require('underscore');
var Fluxxor = require('fluxxor');
var Router = require('ampersand-router');
var SiteState = require('../models/site.js');
var constants = require('../constants');


var actions = {};
actions[constants.ACTIONS.PATH_CHANGE] = 'change';
actions[constants.ACTIONS.ARTICLE_LOADED] = 'updated';
actions[constants.ACTIONS.ARTICLE_FAILED] = 'updated';
actions[constants.ACTIONS.SITE_WAITING] = 'waiting';


module.exports = Fluxxor.createStore({

  initialize: function(initial) {
    this.state = new SiteState(initial);
    this.router = new Router();
  },

  actions: actions,

  change: function(path) {
    this.router.navigate(path, {trigger: false});
    if (window.ga) {window.ga('send', 'pageview');}
    this.state.status = 'LOADING';
    this.emit('change');
  },

  updated: function() {
    this.state.status = 'UPDATED';
    _.delay(this.flux.actions.site.waiting, 200);
    this.emit('change');
  },

  waiting: function() {
    this.state.status = 'WAITING';
    this.emit('change');
  }

});
