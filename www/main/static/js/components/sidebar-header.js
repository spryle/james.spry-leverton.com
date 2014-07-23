/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var SidebarSubTitle = React.createClass({

  render: function() {
    var partial;
    if (this.props.href) {
      partial = <a href={this.props.href}>{this.props.text}</a>;
    } else {
      partial = this.props.text;
    }
    return (
      <h3 className="b-sidebar-sub-title">
        {partial}
      </h3>
    );
  }

});

var SidebarHeader = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('DirectoryStore')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    console.log(flux.store('DirectoryStore').state.getCurrentIndex().name);
    return {
      index: flux.store('DirectoryStore').state.getCurrentIndex(),
    };
  },

  getInitialState: function() {
    return {
      defaultName: 'Web Developer, London'
    };
  },

  render: function() {
    return (
      <header className="b-sidebar-header">
        <h2 className="b-sidebar-title t-logo">
          <a href="">
            <span className="b-sidebar-firstname">James</span> Spry-Leverton
          </a>
        </h2>
        <SidebarSubTitle
          href={this.state.index.path || null}
          text={this.state.index.name || this.state.defaultName}
        />
      </header>
    );
  }

});


module.exports = SidebarHeader;
