var React = require('react');


module.exports = {

  contextTypes: {
    keyboard: React.PropTypes.object
  },

  getKeyboard: function() {
    return this.context.keyboard;
  }

};
