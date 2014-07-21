/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');


var Title = React.createClass({

  render: function() {
    return (
      <title>{this.props.title}</title>
    );
  }

});


module.exports = Title;
