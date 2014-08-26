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

function xDiagonalID(x, y) {
  return Math.floor((y - (x * 2) - 1) / 4);
}

function yDiagonalID(x, y) {
  return Math.floor((y + (x * 2) + 1) / 4);
}

function triangle(options) {

  var x = options.position.x;
  var y = options.position.y;

  var entity = new Entity();

  entity.add(new XDiagonal({
    id: xDiagonalID(x, y),
    num: x,
    additive: false,
    color: '#1a1a1a',
    alpha: 1
  }));

  entity.add(new YDiagonal({
    id: yDiagonalID(x, y),
    num: y,
    additive: false,
    color: '#1a1a1a',
    alpha: 1
  }));

  entity.add(new Visual({
    color: '#1a1a1a',
  }));

  entity.add(new Position({
    x: options.local.x,
    y: options.local.y
  }));

  entity.add(new Display({
    view: new options.View({
      x: options.local.x,
      y: options.local.y,
      height: options.dimensions.height,
      width: options.dimensions.width
    }),
    visible: true
  }));

  return entity;
}

function column(engine, options) {

  _.each(_.range(options.number), function(i) {

    if (options.column % 2 ? i % 2 === 1 : i % 2 === 0) {

      engine.entities.add(triangle({

        View: TRTriangle,

        local: {
          x: options.x,
          y: options.y + (options.size * i)
        },

        dimensions: {
          height: options.size,
          width: options.size,
        },

        position: {
          x: options.column,
          y: i * 2
        }

      }));

      engine.entities.add(triangle({

        View: BLTriangle,

        local: {
          x: options.x,
          y: options.y + (options.size * i)
        },

        dimensions: {
          height: options.size,
          width: options.size,
        },

        position: {
          x: options.column,
          y: (i * 2) + 1
        }

      }));

    } else {

      engine.entities.add(triangle({

        View: TLTriangle,

        local: {
          x: options.x,
          y: options.y + (options.size * i)
        },

        dimensions: {
          height: options.size,
          width: options.size,
        },

        position: {
          x: options.column,
          y: i * 2
        }

      }));

      engine.entities.add(triangle({

        View: BRTriangle,

        local: {
          x: options.x,
          y: options.y + (options.size * i)
        },

        dimensions: {
          height: options.size,
          width: options.size,
        },

        position: {
          x: options.column,
          y: (i * 2) + 1
        }

      }));

    }

  });

}

var Wallpaper = Tarka.extend({

  initialize: function(options) {
    _.each(_.range(options.numX), _.bind(function(index) {
      column(this.engine, {
        column: index,
        number: options.numY,
        x: index * options.size,
        y: 0,
        size: options.size
      });
    }, this));
  },

  xRange: function() {
    return _.range(-Math.ceil(this.options.numX / 4), 0);
  },

  yRange: function() {
    return _.range(
      Math.ceil(this.options.numY / 2),
      Math.ceil(this.options.numY / 2) + Math.ceil(this.options.numX / 4)
    );
  },

  column: function(axis, id) {
    // TODO - column lookup memoize?
    axis = axis === 'x' ? 'x-diagonal' : axis === 'y' ? 'y-diagonal' : null;
    if (!axis) {throw Error('Value Error: invalid axis.');}
    return _.filter(this.engine.entities, function(entity) {
      if (entity.get(axis).id === id) {return entity;}
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

  colors: function(options) {
    var scheme = new Scheme();
    scheme.from_hue(options.hue);
    scheme.scheme(options.scheme);
    scheme.distance(options.distance);
    scheme.variation(options.variation);
    return scheme.colors();
  },

  scheme: function(colors) {
    // TODO - param # of gradients steps / gradients jumps.
    return _.map(colors, function(c) {
      c = color('#' + c);
      return {
        gradient: gradient(
          c.rgbString(),
          c.darken(0.3).rgbString(),
          c.darken(0.6).rgbString(),
          20
        ).toArray('hexString'),
        additive: true
      };
    });
  },

  paint: function(options) {
    var scheme = this.scheme(this.colors(options));
    var xid = _.filter(this.xRange(), _.bind(function() {
      return _.random(0, 100) <= this.options.frequency;
    }, this));
    var yid = _.filter(this.yRange(), _.bind(function() {
      return _.random(0, 100) <= this.options.frequency;
    }, this));
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
      var color = scheme.gradient[
        parseInt(index / (column.length / scheme.gradient.length), 10)
      ];
      diagonal.color = color;
      // TODO - param alpha random noice.
      diagonal.alpha = _.random(97, 100) / 100;
      diagonal.additive = scheme.additive;
    });
    return this;
  },

});


module.exports = function(options) {

  var engine = new Engine();
  engine.systems.add(new Mix(engine));
  engine.systems.add(new Paint(engine));

  return new Wallpaper({
    engine: engine
  }, options);

};

