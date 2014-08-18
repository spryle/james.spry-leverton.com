var _ = require('underscore');
var mousetrap = require('mousetrap');
var Events = require('backbone-events-standalone');


var Keyboard = function(keymap, sequences) {
  this._id = _.uniqueId('keyboard');
  this.buffer = [];
  this.keymap = keymap;
  this.sequences = sequences;
};

_.extend(Keyboard.prototype, Events, {

  start: function() {
    var keyboard = this;
    _.each(this.keymap, function(value, key) {
      mousetrap.bind(key, function(event, combo) {
        keyboard.trigger(value, event, combo);
        keyboard.handle(key);
      });
    });
    return this;
  },

  handle: function(key) {
    if (!key) {return;}
    this.buffer.push(key);
    _.each(this.sequences, _.bind(function(event, sequence) {
      var combo = _.last(this.buffer, sequence.split(' ').length).join(' ');
      if (combo === sequence) {this.trigger(event);}
    }, this));
    if (this.buffer.length > 20) {this.buffer.shift();}
  },

  stop: function() {
    throw new Error('Not Implemented');
  }


});

module.exports = Keyboard;
