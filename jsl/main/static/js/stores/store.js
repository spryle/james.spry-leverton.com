var _ = require('underscore');
var Events = require('backbone-events-standalone');
var extend = require('ampersand-class-extend');
var dispatcher = require('../dispatcher');


var Store = function(data) {
  this.id = _.uniqueId('store');
  this.state = this.encapsulate(data);
  _.bindAll(this, 'handle', 'emit');
  dispatcher.register(this.handle);
  this.initialize.call(this, this.state);
};

Store.extend = extend;

_.extend(Store.prototype, Events, {

  initialize: function() {},

  encapsulate: function(data) {
    return data;
  },

  emit: function() {
    this.trigger('change');
    return this;
  },

  handle: function(payload) {
    if (!this.actions) {return;}
    if (_.has(this.actions, payload.type)) {
      this[this.actions[payload.type]](payload);
    }
    return this.emit();

  }

});

module.exports = Store;
