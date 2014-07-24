/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var cx = require('react-classset');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var WallpaperDebugBarPlay = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  classes: function() {
    return cx({
      'b-wallpaper-button': true,
      'is-play': !this.props.running,
      'is-pause': this.props.running
    });
  },

  toggle: function() {
    if (this.props.running) {
      this.getFlux().actions.wallpaper.pause();
    } else {
      this.getFlux().actions.wallpaper.play();
    }
  },

  render: function() {
    return (
      <li onClick={this.toggle} className={this.classes()}></li>
    );
  }

});


var WallpaperDebugBarFPS = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  getInitialState: function() {
    return {
      fps: this.props.fps
    };
  },

  update: function(wallpaper) {
    this.setState({
      fps: wallpaper.fps()
    });
  },

  componentWillMount: function() {
    this.update = _.throttle(this.update, 500);
    this.getFlux().store('WallpaperStore').state
      .on('update', this.update, this);
  },

  componentWillUnmount: function() {
    this.getFlux().store('WallpaperStore').state
      .off('update', this.update, this);
  },

  render: function() {
    return (
      <li className="b-wallpaper-fps">FPS: {parseInt(this.state.fps, 10)}</li>
    );
  }

});


var WallpaperDebugBar = React.createClass({

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
      <div className="b-wallpaper-debug-bar">
        <ul className="b-wallpaper-button-list">
          <WallpaperDebugBarPlay running={this.state.wallpaper.running} />
          <WallpaperDebugBarFPS fps={this.state.wallpaper.fps()} />
        </ul>
      </div>
    );
  }

});


module.exports = WallpaperDebugBar;
