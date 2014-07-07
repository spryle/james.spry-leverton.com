var _ = require('underscore');
var extend = require('./utils/extend.js');
var degreesToRadians = require('./utils/degrees-to-radians.js');


var View = function(data) {
  this.id = _.uniqueId(this.constructor.type);
  _.extend(this, this.constructor.props, data);
  this.initialize.apply(this, arguments);
};

View.extend = extend;

module.exports = View.extend({

  initialize: function(data) {
    return this;
  },

  transform: function(context) {
    context.translate(this.x, this.y);
    context.rotate(degreesToRadians(this.angle));
    return this;
  },

  draw: function(context) {
    return this;
  },

  paint: function(context) {
    return this;
  },

  render: function(context) {
    this.transform(context);
    this.draw(context);
    this.paint(context);
    return this;
  }

}, {

  props: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    angle: 0,
    fillStyle: 'rgb(0,0,0)',
    strokeStyle: 'black',
    strokeWidth: 1,
    visible: true,
  }

});
