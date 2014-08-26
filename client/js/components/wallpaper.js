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
    FluxChildMixin
  ],

  componentDidMount: function() {
    this.props.wallpaper.setScreen(this.getDOMNode());
    this.props.wallpaper.paint(this.props.page.get('scheme').toJS());
    this.props.wallpaper.render();
  },

  componentDidUpdate: function() {
    this.props.wallpaper.clear();
    this.props.wallpaper.paint(this.props.page.get('scheme').toJS());
    this.props.wallpaper.render();
  },

  shouldComponentUpdate: function(props, state) {
    if (this.props.page === props.page) {return false;}
    return true;
  },

  render: function() {
    return (
      <canvas
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
      page: flux.store('article').page,
      wallpaper: flux.store('wallpaper').wallpaper,
      status: flux.store('site').state.status
    };
  },

  getInitialState: function() {
    return {
      height: window.outerHeight * 1.05,
      width: window.outerWidth * 1.05
    };
  },

  classes: function() {
    var status = this.state.status;
    return cx({
      'b-wallpaper': true,
      'is-initialized': true,
      'is-intro': status === 'UPDATED' || status === 'WAITING',
      'is-outro': status === 'LOADING'
    });
  },

  render: function() {
    return (
      <div className={this.classes()}>
        <Canvas
          width={this.state.width}
          height={this.state.height}
          page={this.state.page}
          wallpaper={this.state.wallpaper}
        />
      </div>
    );
  }

});


module.exports = Wallpaper;
