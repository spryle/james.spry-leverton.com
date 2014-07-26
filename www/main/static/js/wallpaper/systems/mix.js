_ = require('underscore');
var System = require('tarka/system');
var Visual = require('../components/visual');
var YDiagonal = require('../components/x-diagonal');
var XDiagonal = require('../components/y-diagonal');
var color = require('color');


module.exports = System.extend({

  priority: 1,

  target: {
    visual: Visual,
    x: XDiagonal,
    y: YDiagonal
  },

  process: function(target, time) {
    var x = color(target.x.color);
    var y = color(target.y.color);
    x.alpha(target.x.alpha);
    y.alpha(target.y.alpha);
    if (target.x.additive && target.y.additive) {
      target.visual.color = x.mix(y);
    } else if (target.x.additive) {
      target.visual.color = x;
    } else if (target.y.additive) {
      target.visual.color = y;
    } else {
      target.visual.color = x;
    }
  }

});
