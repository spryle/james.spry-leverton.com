var $ = require('jquery');
var _ = require('underscore');
var degreesToRadians = require('./engine/utils/degrees-to-radians.js');

var Engine = require('./engine/engine.js');
var Control = require('./engine/control.js');
var Entity = require('./engine/entity.js');
var Screen = require('./engine/screen.js');

var Paint = require('./systems/paint.js');

var Color = require('./components/color.js');
var Position = require('./components/position.js');
var Display = require('./components/display.js');
var Column = require('./components/column.js');

var TLTriangle = require('./views/tl-triangle.js');
var TRTriangle = require('./views/tr-triangle.js');
var BLTriangle = require('./views/bl-triangle.js');
var BRTriangle = require('./views/br-triangle.js');

var canvas = $('<canvas>');
var wallpaper = $('.b-wallpaper');
canvas.prop({
  height: $(document).height() * 1.2,
  width: $(document).width() * 0.70
});
wallpaper.append(canvas);
var screen = new Screen(canvas.get(0));


var engine = new Engine();
engine.systems.add(new Paint(engine));

var colors = [
  [80, 159, 80],
  [60, 119, 119],
  [181, 157, 194],
  [199, 100, 100],
  [153, 191, 181]
];

var columns = _.map(_.range(25), function() {
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

  engine.entities.add(entity);

}

function column(options) {

  _.each(_.range(options.number), function(i) {

    if (options.column % 2 ? i % 2 === 1: i % 2 === 0) {

      addEntity(new TRTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, i * 2);

      addEntity(new BLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, (i * 2) + 1);


    } else {

      addEntity(new TLTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, i * 2);

      addEntity(new BRTriangle({
        x: options.x,
        y: options.y + (options.size * i),
        height: options.size,
        width: options.size,
      }), options.column, (i * 2) + 1);

    }

  });

}

_.each(_.range(50), function(i) {
  column({
    column: i,
    number: 60,
    x: i * 25,
    y: 0,
    size: 25
  });
});


var wallpaper = new Control(engine, screen, {tick: 1000 / 1});


module.exports = wallpaper;
