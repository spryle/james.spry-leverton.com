var _ = require('underscore');
var Dict = require('collections/dict');

var Entity = function(initial, config) {
  this.id = _.uniqueId('entity');
  this.components = new Dict();
};

_.extend(Entity.prototype, {

  add: function(component) {
    this.components.set(component.constructor.type, component);
  },

  remove: function(component) {
    this.components.remove(component.constructor.type);
  },

  get: function(type) {
    return this.components.get(type);
  }

});

module.exports = Entity;
