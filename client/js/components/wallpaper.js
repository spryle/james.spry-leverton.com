/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Canvas = React.createClass({

  mixins: [
    FluxChildMixin,
  ],

  componentDidMount: function() {
    this.props.wallpaper.setScreen(this.getDOMNode());
    this.props.wallpaper.render();
  },

  getInitialState: function() {
    return {
      height: window.outerHeight * 1.05,
      width: window.outerHeight * 0.80
    };
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

  mixins: [
    FluxMixin,
    StoreWatchMixin('WallpaperStore')
  ],

  getStateFromFlux: function() {
    return {
      wallpaper: this.getFlux().store('WallpaperStore').state,
    };
  },

  render: function() {
    return (
      <div className="b-wallpaper">
        <Canvas wallpaper={this.state.wallpaper} />
      </div>
    );
  }

});


module.exports = Wallpaper;
