var _ = require('underscore');
var gradient = require('gradient');
var color = require('color');
var Scheme = require('color-scheme');

var Engine = require('tarka/engine');
var Tarka = require('tarka/tarka');
var Entity = require('tarka/entity');
var Screen = require('tarka/screen');

var Mix = require('./systems/mix');
var Paint = require('./systems/paint');

var Visual = require('./components/visual');
var Position = require('./components/position');
var Display = require('./components/display');
var XDiagonal = require('./components/x-diagonal');
var YDiagonal = require('./components/y-diagonal');

var TLTriangle = require('./views/tl-triangle');
var TRTriangle = require('./views/tr-triangle');
var BLTriangle = require('./views/bl-triangle');
var BRTriangle = require('./views/br-triangle');


function choice(choices) {
  return choices[_.random(0, choices.length - 1)];
}


function addEntity(view, options) {

  var x = options.x;
  var y = options.y;

  var entity = new Entity();

  var xid = Math.floor((y - (x * 2) - 1) / 4);
  var yid = Math.floor((y + (x * 2) + 1) / 4);

  entity.add(new XDiagonal({
    id: xid,
    num: x,
    additive: false,
    color: '#1a1a1a',
    alpha: 1
  }));

  entity.add(new YDiagonal({
    id: yid,
    num: y,
    additive: false,
    color: '#1a1a1a',
    alpha: 1
  }));

  entity.add(new Visual({
    color: '#1a1a1a',
  }));

  entity.add(new Position({
    x: view.x,
    y: view.y
  }));

  entity.add(new Display({
    view: view,
    visible: true
  }));

  return entity;
}

function column(engine, options) {

  _.each(_.range(options.number), function(i) {

    if (options.column % 2 ? i % 2 === 1: i % 2 === 0) {

      engine.entities.add(addEntity(new TRTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), {
        x:options.column,
        y: i * 2
      }));

      engine.entities.add(addEntity(new BLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), {
        x: options.column,
        y: (i * 2) + 1
      }));

    } else {

      engine.entities.add(addEntity(new TLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), {
        x: options.column,
        y: i * 2
      }));

      engine.entities.add(addEntity(new BRTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), {
        x: options.column,
        y: (i * 2) + 1
      }));

    }

  });

}

var Wallpaper = Tarka.extend({

  scheme: function() {
    var scheme = new Scheme();
    var colors = scheme
      .from_hue(_.random(1, 360))
      .scheme(choice(['mono', 'contrast', 'tetrade', 'analogic', 'triade']))
      .distance(0.3)
      .variation(choice(['pastel', 'soft', 'light', 'pale'])) // 'hard'
      .colors();
    return _.map(colors, function(c) {
      c = color('#' + c);
      return {
        gradients: gradient(
          c.rgbString(),
          c.darken(0.3).rgbString(),
          c.darken(0.6).rgbString(),
          20
        ).toArray('hexString'),
        additive: true
      };
    });

  },

  column: function(axis, id) {
    axis = axis === 'x' ? 'x' : axis === 'y' ? 'y' : null;
    if (!axis) {throw Error('Value Error: invalid axis.');}
    return _.filter(this.engine.entities, function(entity) {
      if (entity.get(axis + '-diagonal').id === id) {return entity;}
    });
  },

  clear: function() {
    _.each(this.engine.entities, function(entity) {
      var x = entity.get('x-diagonal');
      var y = entity.get('y-diagonal');
      x.color = y.color = '#1a1a1a'; //'#0a0a0a';
      x.alpha = y.alpha = 1;
      x.additive = y.additive = false;
    });
  },

  refresh: function() {
    var scheme = this.scheme();
    var xid = _.filter(_.range(-6, 10), function() {
      return _.random(0, 100) > 50;
    });
    var yid = _.filter(_.range(6, 18), function() {
      return _.random(0, 100) > 50;
    });
    _.map(xid, _.bind(function(id) {
      this.add('x', id, choice(scheme));
    }, this));
    _.map(yid, _.bind(function(id) {
      this.add('y', id, choice(scheme));
    }, this));
  },

  add: function(axis, id, scheme) {
    var column = this.column(axis, id);
    _.each(_.sortBy(column, function(entity) {
      return entity.get(axis + '-diagonal').num;
    }), function(entity, index) {
      var diagonal = entity.get(axis + '-diagonal');
      var color = scheme.gradients[
        parseInt(index / (column.length / scheme.gradients.length), 10)
      ];
      diagonal.color = color;
      diagonal.alpha = _.random(97, 100) / 100;
      diagonal.additive = true;
    });
    return this;
  },

});


module.exports = function(options) {

  options = _.extend({
    size: 25,
    frameLength: 1000 / 4,
  }, options);

  var engine = new Engine();
  engine.systems.add(new Mix(engine));
  engine.systems.add(new Paint(engine));

  _.each(_.range(50), function(i) {
    column(engine, {
      column: i,
      number: window.outerHeight / options.size,
      x: i * options.size,
      y: 0,
      size: options.size,
      scale: options.scale
    });
  });

  return new Wallpaper({
    engine: engine
  }, options);

};

