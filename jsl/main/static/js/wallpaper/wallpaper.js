var _ = require('underscore');
var degreesToRadians = require('tarka/utils/degrees-to-radians');

var Engine = require('tarka/engine');
var Tarka = require('tarka/tarka');
var Entity = require('tarka/entity');
var Screen = require('tarka/screen');

var Paint = require('./systems/paint');
var Color = require('./components/color');
var Position = require('./components/position');
var Display = require('./components/display');
var Column = require('./components/column');
var TLTriangle = require('./views/tl-triangle');
var TRTriangle = require('./views/tr-triangle');
var BLTriangle = require('./views/bl-triangle');
var BRTriangle = require('./views/br-triangle');


var colors = [
  [80, 159, 80],
  [60, 119, 119],
  [181, 157, 194],
  [199, 100, 100],
  [153, 191, 181]
];

var columns = _.map(_.range(window.outerHeight * 1.05 / 25), function() {
  return _.random(0, 100) < 25 ? colors[_.random(0, colors.length - 1)] : undefined;
});


function addEntity(view, x, y) {

  var entity = new Entity();

  var colx = Math.abs(Math.floor((y - (x * 2) - 1) / 4));
  var coly = Math.abs(Math.floor((y + (x * 2) + 1) / 4));

  entity.add(new Column({
    x: _.clone(columns[colx] || [10.2, 10.2, 10.2]),
    y: _.clone(columns[coly] || [10.2, 10.2, 10.2])
  }));

  entity.add(new Color({
    rgb: entity.get('column').color(),
    opacity: _.random(25, 100) / 100
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
      }), options.column, i * 2));

      engine.entities.add(addEntity(new BLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, (i * 2) + 1));


    } else {

      engine.entities.add(addEntity(new TLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, i * 2));

      engine.entities.add(addEntity(new BRTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, (i * 2) + 1));

    }

  });

}


module.exports = {

  initialize: function(mount, stores) {

    this.stores = stores;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('height', window.outerHeight * 1.05);
    canvas.setAttribute('width', window.outerHeight * 0.80);
    mount.appendChild(canvas);
    var screen = new Screen(canvas);
    var engine = new Engine();

    engine.systems.add(new Paint(engine));

    _.each(_.range(50), function(i) {
      column(engine, {
        column: i,
        number: window.outerHeight / 25,
        x: i * 25,
        y: 0,
        size: 25
      });
    });

    this.wallpaper = new Tarka(engine, screen, {fps: 1000 / 1});
    return this.wallpaper.render();
  },

  render: function(data) {

  }

};
