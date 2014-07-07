var _ = require('underscore');
var extend = require('./utils/extend.js');


var System = function(engine) {
  this.engine = engine;
  this.initialize.apply(
    this, Array.prototype.slice.call(arguments, 1));
};

_.extend(System.prototype, {

  priority: 0,
  target: null,
  targets: null,

  initialize: function() {},

  update: function(time) {
    var system = this;
    this.targets = this.engine.getNodes(this.target);
    _.each(this.targets, function(target) {
      system.process(target, time);
    });
  }

});

System.extend = extend;

module.exports = System;

