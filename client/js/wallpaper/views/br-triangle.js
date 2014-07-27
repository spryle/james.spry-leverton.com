var View = require('tarka/view');


module.exports = View.extend({

  draw: function(context) {
    context.scale(this.scaleX, this.scaleY);
    context.beginPath();
    context.moveTo(this.width, this.height);
    context.lineTo(0, this.height);
    context.lineTo(this.width, 0);
    context.lineTo(this.width, this.height);
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

  type: 'br-triangle'

});