var _ = require('underscore');
var Fluxxor = require('fluxxor');
var Scheme = require('../models/scheme');
var immutable = require('immutable');
var wallpaper = require('../wallpaper/wallpaper');
var constants = require('../constants');

var actions = {};

actions[constants.ACTIONS.ARTICLE_LOADED] = 'refresh';
actions[constants.ACTIONS.WALLPAPER_PLAY] = 'play';
actions[constants.ACTIONS.WALLPAPER_PAUSE] = 'pause';
actions[constants.ACTIONS.WALLPAPER_REFRESH] = 'refresh';
actions[constants.ACTIONS.WALLPAPER_CLEAR] = 'clear';


module.exports = Fluxxor.createStore({

  initialize: function(data) {
    this.wallpaper = wallpaper();
    this.scheme = new Scheme().randomize();
    this.columns = this.scheme.generate();
  },

  actions: actions,

  refresh: function() {
    this.scheme.randomize();
    this.columns = this.scheme.generate();
    this.emit('change');
  },

  play: function() {
    this.wallpaper.start();
    this.emit('change');
  },

  pause: function() {
    this.wallpaper.stop();
    this.emit('change');
  },

  clear: function() {
    this.wallpaper.clear();
    this.emit('change');
  }

});
