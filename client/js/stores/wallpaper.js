var _ = require('underscore');
var Fluxxor = require('fluxxor');
var immutable = require('immutable');
var wallpaper = require('../wallpaper/wallpaper');
var constants = require('../constants');

var actions = {};

module.exports = Fluxxor.createStore({

  initialize: function(options) {
    this.wallpaper = wallpaper(options);
  },

  actions: actions,

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
