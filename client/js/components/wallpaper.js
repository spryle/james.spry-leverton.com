/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react/addons').addons.classSet;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var Canvas = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  componentDidMount: function() {
    _.defer(_.bind(function() {
      this.props.wallpaper.setScreen(this.getDOMNode());
      this.props.wallpaper.paint(this.props.scheme.toJS());
      this.props.wallpaper.render();
    }, this));
  },

  getInitialState: function() {
    return {
      rendering: false
    };
  },

  redraw: function() {
    this.props.wallpaper.clear();
    this.props.wallpaper.paint(this.props.scheme.toJS());
    this.props.wallpaper.render();
    _.defer(this.rendering, false);
  },

  rendering: function(bool) {
    this.setState({rendering: bool});
  },

  componentDidUpdate: function() {
    if (this.state.rendering) {
      _.defer(this.redraw);
    }
  },

  componentWillReceiveProps: function(props) {
    if (this.props.status !== props.status &&
        props.status === 'WAITING') {
      this.rendering(true);
    }
  },

  classes: function() {
    return cx({
      'is-rendering': this.state.rendering,
    });
  },

  render: function() {
    return (
      <canvas
        className={this.classes()}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }

});

var Wallpaper = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('article', 'wallpaper', 'site')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      scheme: flux.store('article').page.get('scheme'),
      wallpaper: flux.store('wallpaper').wallpaper,
      status: flux.store('site').state.status
    };
  },

  getInitialState: function() {
    return {
      height:  window.screen.height * 1.05,
      width: window.screen.width * 1.05
    };
  },

  classes: function() {
    var status = this.state.status;
    return cx({
      'b-wallpaper': true,
      'is-initialized': true,
      'is-intro': status === 'WAITING',
      'is-outro': status === 'UPDATED' || status === 'LOADING'
    });
  },

  render: function() {
    return (
      <div className={this.classes()}>
        <Canvas
          width={this.state.width}
          height={this.state.height}
          scheme={this.state.scheme}
          wallpaper={this.state.wallpaper}
          status={this.state.status}
        />
      </div>
    );
  }

});


module.exports = Wallpaper;
