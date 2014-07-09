_ = require('underscore');
var System = require('tarka/system');
var Color = require('../components/color');
var Display = require('../components/display');

function toRGBA(c, o) {
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + o + ')';
}

module.exports = System.extend({

  priority: 20,

  target: {
    color: Color,
    display: Display,
  },

  process: function(target, time) {
    target.display.view.fillStyle = toRGBA(target.color.rgb, target.color.opacity);
  }

});
