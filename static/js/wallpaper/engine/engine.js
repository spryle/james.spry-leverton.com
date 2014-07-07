var _ = require('underscore');
var ShimArray = require('collections/shim-array');
var SortedArray = require('collections/sorted-array');
var FastMap = require('collections/fast-map');


var EntityList = function(values, engine) {
  this.engine = engine;
  ShimArray.apply(this, values);
};

_.extend(EntityList, ShimArray);

EntityList.prototype = (function(Prototype) {
  Prototype.prototype = ShimArray.prototype;
  return new Prototype();
})(function() {});

EntityList.prototype.constructor = ShimArray;

_.extend(EntityList.prototype, {

  add: function(value) {
    this.engine.nodes = new FastMap();
    return ShimArray.prototype.add.apply(this, arguments);
  },

  delete: function(value) {
    this.engine.nodes = new FastMap();
    return ShimArray.prototype.delete.apply(this, arguments);
  }

});

var SystemList = function(values, options, engine) {
  this.engine = engine;
  SortedArray.apply(this, [
    values,
    options.equals,
    options.compare,
    options.getDefault
  ]);
};

_.extend(SystemList, SortedArray);

SystemList.prototype = (function(Prototype) {
  Prototype.prototype = SortedArray.prototype;
  return new Prototype();
})(function() {});

SystemList.prototype.constructor = SortedArray;

_.extend(SystemList.prototype, {

  add: function(value) {
    return SortedArray.prototype.add.apply(this, arguments);
  },

  delete: function(value) {
    return SortedArray.prototype.delete.apply(this, arguments);
  }

});

var Engine = function() {
  this.entities = new EntityList([], this);
  this.systems = new SystemList([], {}, this);
  this.nodes = new FastMap();
};

_.extend(Engine.prototype, {

  update: function(time) {
    this.systems.forEach(function(system) {
      if (!system.process) {return;}
      system.update(time);
    });
  },

  getNodes: function(target) {
    var nodes = this.nodes.get(target) || [];
    if (nodes.length) {
      return nodes;
    }
    this.entities.forEach(function(entity) {
      var node = {};
      _.each(_.pairs(target), function(pair) {
        var key = pair[0];
        var value = pair[1];
        if (!node) {return;}
        if (_.isUndefined(value)) {
          throw new Error('Unknown Component ' + key);
        }
        var component = entity.get(value.type);
        if (component) {
          node[key] = component;
        } else {
          node = null;
        }
      });
      if (node) {
        nodes.push(node);
      }
    });
    this.nodes.set(target, nodes);
    return nodes;
  }

});

module.exports = Engine;
