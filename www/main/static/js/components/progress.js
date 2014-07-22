/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');


var Progress = React.createClass({

  getInitialState: function() {
    return {
      max: 100,
    };
  },

  value: function() {
    switch (this.props.status) {
      case 'UPDATED':
        return 100;
      case 'LOADING':
        return 50;
      case 'WAITING':
        return 0;
      default:
        return 0;
    }
  },

  render: function() {
    return (
      <div className="b-progress">
        <progress
          value={this.value()}
          max={this.state.max}
        />
      </div>
    );
  }

});


module.exports = Progress;
