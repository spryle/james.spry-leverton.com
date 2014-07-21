var _ = require('underscore');
var Events = require('backbone-events-standalone');
var extend = require('ampersand-class-extend');
var dispatcher = require('../dispatcher');


var Store = function(data) {
  this.id = _.uniqueId('store');
  this.state = this.encapsulate(data);
  _.bindAll(this, 'handle', 'commit');
  dispatcher.register(this.handle);
  this.initialize.call(this, this.state);
};

Store.extend = extend;

_.extend(Store.prototype, Events, {

  initialize: function() {},

  encapsulate: function(data) {
    return data;
  },

  commit: function() {
    this.trigger('commit');
    return this;
  },

  handle: function(payload) {
    if (!this.actions) {return;}
    if (_.has(this.actions, payload.type)) {
      if (this[this.actions[payload.type]](payload)) {
        this.commit();
      }
    }
    return this;
  }

});

module.exports = Store;
