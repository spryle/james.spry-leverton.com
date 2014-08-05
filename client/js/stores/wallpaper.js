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
    this._wallpaper = wallpaper();
    this._scheme = new Scheme();
    this._scheme.randomize();
    this.columns = this._scheme.generate();
  },

  actions: actions,

  refresh: function() {
    this._scheme.randomize();
    this.columns = this._scheme.generate();
    this.emit('change');
  },

  play: function() {
    this._wallpaper.start();
    this.emit('change');
  },

  pause: function() {
    this._wallpaper.stop();
    this.emit('change');
  },

  clear: function() {
    this._wallpaper.clear();
    this.emit('change');
  }

});
