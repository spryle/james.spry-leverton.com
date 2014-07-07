var Component = require('../engine/component.js');
var _ = require('underscore');

var Color = Component.extend({

  initialize: function(data) {
    this.x = data.x;
    this.y = data.y;
  },

  color: function() {
    var rgb = [];
    rgb[0] = this.x[0] - (this.x[0] - this.y[0]) / 2;
    rgb[1] = this.x[1] - (this.x[1] - this.y[1]) / 2;
    rgb[2] = this.x[2] - (this.x[2] - this.y[2]) / 2;
    return rgb;
  }

}, {

  type: 'column'

});

module.exports = Color;
