/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var Title = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('article', 'directory'),
    PureRenderMixin
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var page = flux.store('article').page;
    var index = flux.store('directory').index;
    return {
      title: page && page.get('name') ? page.get('name') :
        index && index.get('name') ? index.get('name') : ''
    };
  },

  render: function() {
    return (
      <title>{this.state.title}</title>
    );
  }

});


module.exports = Title;
