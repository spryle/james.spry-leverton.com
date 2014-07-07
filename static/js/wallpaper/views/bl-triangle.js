var View = require('../engine/view.js');
var _ = require('underscore');

module.exports = View.extend({

  draw: function(context) {
    context.beginPath();
    context.moveTo(0, this.height);
    context.lineTo(0, 0);
    context.lineTo(this.width, this.height);
    context.lineTo(0, this.height);
    context.closePath();
    return this;
  },

  paint: function(context) {
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;
    context.fill();
    // context.stroke();
    return this;
  }

}, {

  type: 'bl-triangle'

});
