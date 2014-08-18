/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');
var cx = require('react/addons').addons.classSet;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var LoaderMixin = require('react-loadermixin');


module.exports =  React.createClass({

  mixins: [
    LoaderMixin,
    PureRenderMixin
  ],

  getInitialState: function() {
    return {
      status: 'LOADING'
    };
  },

  loaderDidLoad: function() {
    this.setState({status: 'LOADED'});
  },

  loaderDidError: function(error) {
    this.setState({loaded: 'FAILED'});
  },

  classes: function() {
    return cx({
      'b-image': true,
      'is-loading': this.state.status === 'LOADING',
      'is-loaded': this.state.status === 'LOADED',
      'is-error': this.state.status === 'ERROR'
    });
  },

  render: function() {
    return (
      <div className={this.classes()}>
        {this.renderLoader(React.DOM.img)}
      </div>
    );
  }

});

