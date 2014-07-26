_ = require('underscore');
var System = require('tarka/system');
var Visual = require('../components/visual');
var Display = require('../components/display');


module.exports = System.extend({

  priority: 10,

  target: {
    visual: Visual,
    display: Display,
  },

  process: function(target, time) {
    target.display.view.fillStyle = target.visual.color.rgbString();
  }

});
