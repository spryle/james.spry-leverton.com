var _ = require('underscore');
var Fluxxor = require('fluxxor');
var constants = require('../constants');

var actions = {};
actions[constants.ACTIONS.WALLPAPER_PLAY] = 'play';
actions[constants.ACTIONS.WALLPAPER_PAUSE] = 'pause';

module.exports = Fluxxor.createStore({

  initialize: function(state) {
    this.state = state;
  },

  actions: actions,

  play: function() {
    this.state.start();
    this.emit('change');
  },

  pause: function() {
    this.state.stop();
    this.emit('change');
  }

});
