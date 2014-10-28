/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');
var settings = require('settings');


var SidebarSubTitle = React.createClass({

  mixins: [
    FluxChildMixin,
    PureRenderMixin
  ],

  change: function(event) {
    this.getFlux().actions.path.change(this.props.href);
    event.stopPropagation();
    event.preventDefault();
  },

  render: function() {
    var partial;
    if (this.props.href) {
      partial = (
        <a href={this.props.href} onClick={this.change}>{this.props.text}</a>
      );
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
    StoreWatchMixin('directory')
  ],

  home: function(event) {
    this.getFlux().actions.path.change('/');
    event.stopPropagation();
    event.preventDefault();
  },

  getStateFromFlux: function() {
    return {
      index: this.getFlux().store('directory').index,
    };
  },

  getInitialState: function() {
    return {
      defaultName: 'Web Developer, London'
    };
  },

  render: function() {
    return (
      <header className="b-sidebar-header is-initialized">

        <a href="/">
          <img
            className="b-sidebar-logo"
            src={settings.MEDIA_URL + "logo-white.svg"} />
        </a>

        <h2 className="b-sidebar-title t-logo">
          <a href="/">
            <span className="b-sidebar-firstname">James</span> Spry-Leverton
          </a>
        </h2>

        <SidebarSubTitle
          href={this.state.index.get('path') || null}
          text={this.state.index.get('name') || this.state.defaultName}
        />
      </header>
    );
  }

});


module.exports = SidebarHeader;
