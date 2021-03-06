/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react/addons').addons.classSet;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var Progress = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('site'),
    PureRenderMixin
  ],

  getInitialState: function() {
    return {
      max: 100,
    };
  },

  value: function() {
    switch (this.state.status) {
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

  getStateFromFlux: function() {
    return this.getFlux().store('site').state.toJSON();
  },

  classes: function() {
    var className = {};
    className['is-initialized'] = true;
    className['is-' + this.state.status.toLowerCase()] = true;
    className['b-progress'] = true;
    return cx(className);
  },

  render: function() {
    return (
      <div className={this.classes()}>
        <progress
          value={this.value()}
          max={this.state.max}
        />
      </div>
    );
  }

});

module.exports = Progress;
