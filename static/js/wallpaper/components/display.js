var Component = require('../engine/component.js');
var _ = require('underscore');


var Display = Component.extend({

  initialize: function(data) {
    this.visible = data.visible;
    this.view = data.view;
  },

}, {

  type: 'display'

});

module.exports = Display;
