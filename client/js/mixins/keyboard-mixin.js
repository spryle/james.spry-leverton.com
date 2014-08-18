var React = require('react');


module.exports = {

  propTypes: {
    keyboard: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    keyboard: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      keyboard: this.props.keyboard
    };
  },

  getKeyboard: function() {
    return this.props.keyboard;
  }
};
