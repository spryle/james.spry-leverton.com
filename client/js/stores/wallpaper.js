var _ = require('underscore');
var Fluxxor = require('fluxxor');
var constants = require('../constants');

var actions = {};

actions[constants.ACTIONS.ARTICLE_LOADED] = 'refresh';
actions[constants.ACTIONS.WALLPAPER_PLAY] = 'play';
actions[constants.ACTIONS.WALLPAPER_PAUSE] = 'pause';
actions[constants.ACTIONS.WALLPAPER_REFRESH] = 'refresh';
actions[constants.ACTIONS.WALLPAPER_CLEAR] = 'clear';


module.exports = Fluxxor.createStore({

  initialize: function(state) {
    this.state = state;
  },

  actions: actions,

  refresh: function() {
    this.state.clear();
    this.state.refresh();
    this.state.render();
    this.emit('change');
  },

  play: function() {
    this.state.start();
    this.emit('change');
  },

  pause: function() {
    this.state.stop();
    this.emit('change');
  },

  clear: function() {
    this.state.clear();
    this.state.render();
    this.emit('change');
  }

});
