var Component = require('tarka/component');
var color = require('color');
var _ = require('underscore');


module.exports = Component.extend({

  initialize: function(data) {
    this.id = data.id;
    this.num = data.num;
    this.color = data.color;
    this.additive = data.additive;
  }

}, {

  type: 'y-diagonal'

});
