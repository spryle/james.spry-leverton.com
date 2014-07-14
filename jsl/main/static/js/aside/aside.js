/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var dom = require('../dom');
var React = require('react');
var cx = require('react-classset');


function dummyImage(domain, options) {
  return domain +
    '/' + options.height +
    'x' + options.width +
    '/' + options.background +
    '/' + options.forground + '.png';
}

var AsideImage = React.createClass({

  classes: function() {
    return cx({
      'b-aside-component': true,
    });
  },

  styles: function() {
    return {
      height: this.props.enlarged ? window.outerHeight : undefined,
      width: this.props.enlarged ? window.outerWidth: undefined
    };
  },

  render: function() {
    var classes = this.classes();
    var styles = this.styles();
    return (
      <aside className={classes} style={styles}>
        <img
          src={this.props.src}
          alt={this.props.alt}
        />
        <p>{this.props.text}</p>
      </aside>
    );
  }

});



var AsideItem = React.createClass({

  componentWillMount: function() {
    window.addEventListener('scroll', this.scroll);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.scroll);
  },

  getInitialState: function() {
    return {
      enlarged: false
    };
  },

  scroll: function() {
    this.setState({
      scrollY: window.scrollY
    });
  },

  enlarge: function() {
    this.setState({
      scrollY: window.scrollY,
      enlarged: !this.state.enlarged
    });
  },

  classes: function() {
    return cx({
      'b-aside-list-item': true,
      'is-enlarged': this.state.enlarged
    });
  },

  styles: function() {
    return {
      top: this.state.enlarged ? this.state.scrollY: this.props.position.top,
      position: 'absolute'
    };
  },

  src: function() {
    return dummyImage(this.props.data.src, {
      height: this.state.enlarged ? window.outerHeight : 200,
      width: this.state.enlarged ? window.outerHeight : 200,
      background: '303030',
      forground: 'fff'
    });
  },

  render: function() {
    var classes = this.classes();
    var styles = this.styles();
    var enlarged = this.state.enlarged;
    var src = this.src();
    return (
      <li className={classes} style={styles} onClick={this.enlarge}>
        <AsideImage
          src={src}
          alt={this.props.data.alt}
          enlarged={enlarged}
        />
      </li>
    );
  }

});

var AsideList = React.createClass({

  items: function() {
    var item = {};
    this.props.asides.each(_.bind(function(data) {
      item[data.target] = AsideItem({
        data: data,
        position: this.props.positions[data.target]
      });
    }, this));
    return item;
  },

  render: function() {
    var items = this.items();
    return (
      <ol className="b-aside-list">{items}</ol>
    );
  }

});

module.exports = {

  initialize: function(mount, data) {
    this.component = React.renderComponent(
      <AsideList asides={data.asides} positions={data.positions}/>,
      mount
    );
    dom.addClass(mount, 'is-initialized');
    return this.component;
  },

  render: function(data) {
    this.component.setProps(data);
    return this.component;
  }

};
