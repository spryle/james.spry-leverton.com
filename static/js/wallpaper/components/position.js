var Component = require('../engine/component.js');

var Position = Component.extend({

  initialize: function(data) {
    this.x = data.x;
    this.y = data.y;
  }

}, {

  type: 'position'

});

module.exports = Position;
