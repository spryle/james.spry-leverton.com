/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var Title = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('article', 'directory')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var page = flux.store('article').state.getCurrentPage();
    var index = flux.store('directory').state.getCurrentIndex();
    return {
      title: page && page.name ? page.name :
        index && index.name ? index.name : ''
    };
  },

  render: function() {
    return (
      <title>{this.state.title}</title>
    );
  }

});


module.exports = Title;
