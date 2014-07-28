/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react-classset');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


function height() {
  var body = document.body;
  var html = document.documentElement;
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}


var Canvas = React.createClass({

  mixins: [
    FluxChildMixin,
  ],

  componentDidMount: function() {
    this.props.wallpaper.setScreen(this.getDOMNode());
    this.props.wallpaper.refresh();
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
    StoreWatchMixin('WallpaperStore', 'SiteStore')
  ],

  // componentWillMount: function() {
  //   window.addEventListener('scroll', this.scroll);
  // },

  // componentWillUnmount: function() {
  //   window.removeEventListener('scroll', this.scroll);
  // },

  scroll: function() {
    this.setState({
      scrollY: window.scrollY
    });
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      wallpaper: flux.store('WallpaperStore').state,
      status: flux.store('SiteStore').state.status
    };
  },

  getInitialState: function() {
    return {
      scrollY: window.scrollY
    };
  },

  styles: function() {
    return {
      top: -this.state.scrollY / height() * 100
    };
  },

  classes: function() {
    var status = this.state.status;
    return cx({
      'b-wallpaper': true,
      'is-intro': status === 'UPDATED' || status === 'WAITING',
      'is-outro': status === 'LOADING'
    });
  },

  render: function() {
    return (
      <div className={this.classes()} style={this.styles()}>
        <Canvas wallpaper={this.state.wallpaper} />
      </div>
    );
  }

});


module.exports = Wallpaper;
