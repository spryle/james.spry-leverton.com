var _ = require('underscore');
var gradient = require('gradient');
var color = require('color');
var Scheme = require('color-scheme');
var Events = require('backbone-events-standalone');

var Engine = require('tarka/engine');
var Tarka = require('tarka/tarka');
var Entity = require('tarka/entity');
var Screen = require('./screen');

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

var DEFAULT_COLOR = '#1a1a1a';
var DEFAULT_ALPHA = 1;
var DEFAULT_ADDITIVE = false;
var DEFAULT_VISIBLE = true;

function choice(choices) {
  return choices[_.random(0, choices.length - 1)];
}

function xDiagonalID(x, y) {
  return Math.floor((y - (x * 2) - 1) / 4);
}

function yDiagonalID(x, y) {
  return Math.floor((y + (x * 2) + 1) / 4);
}

function view(rotation) {
  switch (rotation) {
    case 'tl':
      return TLTriangle;
    case 'tr':
      return TRTriangle;
    case 'bl':
      return BLTriangle;
    case 'br':
      return BRTriangle;
    default:
      throw 'Invalid rotation.';
  }
}

function rotation(column, row) {
  if (column % 2) {
    return ['tl', 'br', 'tr', 'bl'][row % 4];
  } else {
    return ['tr', 'bl', 'tl', 'br'][row % 4];
  }
}

function triangle(options) {

  var entity = new Entity();

  var View = view(rotation(options.column, options.row));

  entity.add(new XDiagonal({
    id: options.xId,
    num: options.column,
    additive: DEFAULT_ADDITIVE,
    color: DEFAULT_COLOR,
    alpha: DEFAULT_ALPHA
  }));

  entity.add(new YDiagonal({
    id: options.yId,
    num: options.row,
    additive: DEFAULT_ADDITIVE,
    color: DEFAULT_COLOR,
    alpha: DEFAULT_ALPHA
  }));

  entity.add(new Visual({
    color: DEFAULT_COLOR,
  }));

  entity.add(new Position({
    x: options.x,
    y: options.y
  }));

  entity.add(new Display({
    view: new View({
      x: options.x,
      y: options.y,
      height: options.height,
      width: options.width
    }),
    visible: DEFAULT_VISIBLE
  }));

  return entity;
}


var Wallpaper = function(initial, options) {
  this.engine = initial.engine ? initial.engine : null;
  this.screen = initial.screen ? initial.screen : null;
  this.options = options || {};
  this.initialize.call(this, options);
};

Events.mixin(Wallpaper.prototype);

_.extend(Wallpaper.prototype, {

  initialize: function(options) {

    this.grid = _.map(_.range(options.numX), function() {return [];});
    this.diagonals = {x: {}, y: {}};
    this.active = {x: [], y: []};

    _.each(this.grid, _.bind(function(array, column) {
      _.each(_.range(options.numY * 2), _.bind(function(row) {

        var xId = xDiagonalID(column, row);
        var yId = yDiagonalID(column, row);
        if (!this.diagonals.x[xId]) {this.diagonals.x[xId] = [];}
        if (!this.diagonals.y[yId]) {this.diagonals.y[yId] = [];}

        var entity = triangle({
          xId: xId,
          yId: yId,
          column: column,
          row: row,
          x: options.size * column,
          y: options.size * Math.floor(row / 2),
          height: options.size,
          width: options.size
        });

        array.push(entity);
        this.engine.entities.add(entity);
        this.diagonals.x[xId].push(entity);
        this.diagonals.y[yId].push(entity);

      }, this));
    }, this));
    return this;
  },

  setScreen: function(canvas) {
    this.screen = new Screen(canvas);
    return this;
  },

  setEngine: function(options) {
    this.engine = new Engine(engine);
    return this;
  },

  update: function(time) {
    this.trigger('pre-update', this);
    this.engine.update(time);
    this.screen.render(this.engine.entities);
    this.trigger('post-update', this);
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

  clear: function(axis, id) {
    var column = this.diagonals[axis][id];
    _.each(column, function(entity) {
      var diagonal = entity.get(axis + '-diagonal');
      diagonal.color = DEFAULT_COLOR;
      diagonal.alpha = DEFAULT_ALPHA;
      diagonal.additive = DEFAULT_ADDITIVE;
    });
  },

  clearAll: function() {
    _.each(this.active.x, _.bind(function(id) {
      this.clear('x', id);
    }, this));
    _.each(this.active.y, _.bind(function(id) {
      this.clear('y', id);
    }, this));
    this.active.x.length = 0;
    this.active.y.length = 0;
  },

  paint: function(options) {
    var scheme = this.scheme(this.colors(options));
    _.map(this.xRange(), _.bind(function(id) {
      if (_.random(0, 100) <= this.options.frequency) {
        this.add('x', id, choice(scheme));
      }
    }, this));
    _.map(this.yRange(), _.bind(function(id) {
      if (_.random(0, 100) <= this.options.frequency) {
        this.add('y', id, choice(scheme));
      }
    }, this));
  },

  add: function(axis, id, scheme) {
    var column = this.diagonals[axis][id];
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
    this.active[axis].push(id);
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

