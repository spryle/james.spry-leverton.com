var _ = require('underscore');
var extend = require('./utils/extend.js');


var Screen = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
};

_.extend(Screen.prototype, {

  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  render: function(entities) {
    this.clear();
    entities.forEach(_.bind(function(entity) {
      var display = entity.components.get('display');
      if (!display) {return;}
      this.context.save();
      display.view.render(this.context);
      this.context.restore();
    }, this));
  }

});

Screen.extend = extend;

module.exports = Screen;

