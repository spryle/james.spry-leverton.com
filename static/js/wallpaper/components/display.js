var _ = require('underscore');
var Component = require('tarka/component');


var Display = Component.extend({

  initialize: function(data) {
    this.visible = data.visible;
    this.view = data.view;
  },

}, {

  type: 'display'

});

module.exports = Display;
