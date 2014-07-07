var Component = require('../engine/component.js');
var _ = require('underscore');


function mod(rgb, percent) {
  rgb[0] = parseInt(rgb[0] * (100 + percent) / 100);
  rgb[1] = parseInt(rgb[1] * (100 + percent) / 100);
  rgb[2] = parseInt(rgb[2] * (100 + percent) / 100);
  rgb[0] = rgb[0] < 30 ? 30 : rgb[0] > 230 ? 230 : rgb[0];
  rgb[1] = rgb[1] < 30 ? 30 : rgb[1] > 230 ? 230 : rgb[1];
  rgb[2] = rgb[2] < 30 ? 30 : rgb[2] > 230 ? 230 : rgb[2];
  return rgb;
}

function lighten(rgb, percent) {
  return mod(rgb, percent);
}

function darken(rgb, percent) {
  return mod(rgb, -percent);
}

var Color = Component.extend({

  initialize: function(data) {
    this.rgb = data.rgb;
    this.opacity = data.opacity;
    if (_.random(0, 1)) {
      this.darken(_.random(0, 3));
    } else {
      this.lighten(_.random(0, 4));
    }
  },

  darken: function(percent) {
    this.rgb = darken(this.rgb, percent);
  },

  lighten: function(percent) {
    this.rgb = lighten(this.rgb, percent);
  },

  isBlack: function() {
    return this.rgb[0] === 0 && this.rgb[1] === 0 && this.rgb[2] === 0;
  }

}, {

  type: 'color'

});

module.exports = Color;
