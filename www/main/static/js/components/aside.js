/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');
var cx = require('react-classset');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


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
    var el = document.getElementById(this.props.target);
    return {
      top: el ? el.offsetTop: 0,
      enlarged: false
    };
  },

  scroll: function() {
    if (!this.state.enlarged) {return;}
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
      top: this.state.enlarged ? this.state.scrollY: this.state.top,
      position: 'absolute'
    };
  },

  src: function() {
    return dummyImage(this.props.src, {
      height: this.state.enlarged ? window.outerHeight : 200,
      width: this.state.enlarged ? window.outerHeight : 200,
      background: '303030',
      forground: 'fff'
    });
  },

  render: function() {
    return (
      <li className={this.classes()}
          style={this.styles()}
          onClick={this.enlarge}>

        <AsideImage
          src={this.src()}
          alt={this.props.alt}
          enlarged={this.state.enlarged}
        />

      </li>
    );
  }

});

var AsideList = React.createClass({


  items: function() {
    var item = {};
    this.props.page.asides.each(_.bind(function(data) {
      item[data.target] = AsideItem(data.toJSON());
    }, this));
    return item;
  },

  render: function() {
    return (
      <ol className="b-aside-list">{this.items()}</ol>
    );
  }

});

var Aside = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('ArticleStore')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      page: flux.store('ArticleStore').state.getCurrentPage(),
    };
  },

  render: function() {
    if (this.state.page) {
      return (
        <div className="b-aside">
          <AsideList page={this.state.page} />
        </div>
      );
    } else {
      return (
        <div className="b-aside" />
      );
    }
  }

});

module.exports = Aside;
