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
    StoreWatchMixin('ArticleStore', 'DirectoryStore')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var page = flux.store('ArticleStore').state.getCurrentPage();
    var index = flux.store('DirectoryStore').state.getCurrentIndex();
    return {
      title: page && page.name ? page.name : index.name
    };
  },

  render: function() {
    return (
      <title>{this.state.title}</title>
    );
  }

});


module.exports = Title;
