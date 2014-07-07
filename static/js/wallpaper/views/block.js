var View = require('../engine/view.js');
var _ = require('underscore');
var degreesToRadians = require('../utils/degrees-to-radians.js');


module.exports = View.extend({

  transform: function(context) {
    context.translate(
      (this.x + this.width / 2),
      (this.y + this.height / 2)
    );
    context.rotate(degreesToRadians(this.angle));
    return this;
  },

  draw: function(context) {
    context.beginPath();
    var widthBy2 = this.width / 2;
    var heightBy2 = this.height / 2;
    context.moveTo(-widthBy2, -heightBy2);
    context.lineTo(widthBy2, -heightBy2);
    context.lineTo(widthBy2, heightBy2);
    context.lineTo(-widthBy2, heightBy2);
    context.closePath();
    return this;
  },

  paint: function(context) {
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;
    context.fill();
    context.stroke();
    return this;
  }

}, {
  type: 'block'

});
