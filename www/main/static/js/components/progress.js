/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var Progress = React.createClass({

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

  mixins: [
    FluxMixin,
    StoreWatchMixin('SiteStore')
  ],

  getStateFromFlux: function() {
    return  this.getFlux().store('SiteStore').state.toJSON();
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
