/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');
var cx = require('react-classset');
var LoaderMixin = require('react-loadermixin');


module.exports =  React.createClass({

  mixins: [
    LoaderMixin
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

  styles: function() {
    return {
      'min-height': this.state.status !== 'LOADED' ?
        this.props.height || this.props.width : undefined,
      'min-width': this.state.status !== 'LOADED' ?
        this.props.width || this.props.height : undefined
    };
  },

  render: function() {
    return (
      <div className={this.classes()} style={this.styles()}>
        {this.renderLoader(React.DOM.img)}
      </div>
    );
  }

});

