/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var cx = require('react/addons').addons.classSet;
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

var WallpaperDebugBarRefresh = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  classes: function() {
    return cx({
      'b-wallpaper-button': true,
      'is-refresh': true
    });
  },

  refresh: function() {
    this.getFlux().actions.wallpaper.refresh();
  },

  render: function() {
    return (
      <li onClick={this.refresh} className={this.classes()}></li>
    );
  }

});

var WallpaperDebugBarClear = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  classes: function() {
    return cx({
      'b-wallpaper-button': true,
      'is-clear': true
    });
  },

  clear: function() {
    this.getFlux().actions.wallpaper.clear();
  },

  render: function() {
    return (
      <li onClick={this.clear} className={this.classes()}></li>
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
    this.props.wallpaper.on('update', this.update, this);
  },

  componentWillUnmount: function() {
    this.props.wallpaper.off('update', this.update, this);
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
    StoreWatchMixin('wallpaper')
  ],

  getStateFromFlux: function() {
    return {
      wallpaper: this.getFlux().store('wallpaper').wallpaper,
    };
  },

  getInitialState: function() {
    return {
      isOpen: false
    };
  },

  toggle: function() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  classes: function() {
    return cx({
      'b-wallpaper-button': true,
      'is-info': true,
      'is-open': !this.state.isOpen
    });
  },

  components: function() {
    return this.state.isOpen ? (
      <WallpaperDebugBarRefresh />
    ) : null;
  },

  render: function() {
    return (
      <div className="b-wallpaper-debug-bar is-initialized">
        <ul className="b-wallpaper-button-list">
          {this.components()}
          <li className={this.classes()} onClick={this.toggle}/>
        </ul>
      </div>
    );
  }

});


module.exports = WallpaperDebugBar;
