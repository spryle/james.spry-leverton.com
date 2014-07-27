var _ = require('underscore');
var Component = require('tarka/component');
var color = require('color');


module.exports = Component.extend({

  initialize: function(data) {
    this.color = color(data.color || '#FFFFFF');
    this.alpha = data.alpha || 1;
  }

}, {

  type: 'visual'

});
