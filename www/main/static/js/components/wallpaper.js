/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var wallpaper = require('../wallpaper/wallpaper');


var Canvas = React.createClass({

  getInitialState: function() {
    return {
      wallpaper: null,
      height: window.outerHeight * 1.05,
      width: window.outerHeight * 0.80
    };
  },

  componentDidMount: function() {
    this.setState({
      wallpaper: wallpaper.initialize(this.getDOMNode())
    });
    this.state.wallpaper.render();
  },

  render: function() {
    return (
      <canvas
        height={this.state.height}
        width={this.state.width}
      />
    );
  }

});


var Wallpaper = React.createClass({

  render: function() {
    return (
      <div className="b-wallpaper">
        <Canvas />
      </div>
    );
  }

});


module.exports = Wallpaper;
