/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');
var cx = require('react/addons').addons.classSet;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var image = require('../contrib/image');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Image = require('./image');
var constants = require('../constants');


var AsideImage = React.createClass({

  mixins: [
    PureRenderMixin
  ],

  classes: function() {
    return cx({
      'b-aside-component': true
    });
  },

  styles: function() {
    return {
      height: this.props.enlarged ? window.outerHeight : undefined,
      width: this.props.enlarged ? window.outerWidth: undefined
    };
  },

  height: function() {
    return this.props.enlarged ? window.outerHeight * 0.8 : undefined;
  },

  width: function() {
    return this.props.enlarged ? undefined: 200;
  },

  src: function() {
    return image(this.props.src, {
      h: this.height(),
      w: this.width()
    });
  },

  text: function() {
    return (
      <p className="b-aside-component-context">
        {this.props.text}
      </p>
    );
  },

  render: function() {
    var classes = this.classes();
    var styles = this.styles();
    return (
      <aside className={classes} style={styles}>
        <div className="b-aside-image">
          <Image
            src={this.src()}
            alt={this.props.alt}
            height={this.height()}
            width={this.width()}
          />
          {this.props.text ? this.text() : null}
        </div>
      </aside>
    );
  }

});


var AsideGallery = React.createClass({

  mixins: [
    PureRenderMixin
  ],

  getInitialState: function() {
    return {
      index: 0
    };
  },

  classes: function() {
    return cx({
      'b-aside-component': true,
    });
  },

  height: function() {
    return this.props.enlarged ? window.outerHeight * 0.8 : undefined;
  },

  width: function() {
    return this.props.enlarged ? undefined: 200;
  },

  styles: function() {
    return {
      height: this.props.enlarged ? window.outerHeight : undefined,
      width: this.props.enlarged ? window.outerWidth: undefined
    };
  },

  image: function() {
    return this.props.images.get(this.index()).toObject();
  },

  src: function() {
    return image(this.image().src, {
      h: this.props.enlarged ? window.outerHeight * 0.8 : undefined,
      w: this.props.enlarged ? undefined: 200
    });
  },

  index: function() {
    if (this.state.index > this.props.images.length - 1 ||
        this.state.index < 0) {
      this.setState({index: 0});
      return 0;
    } else {
      return this.state.index;
    }
  },

  next: function(event) {
    event.stopPropagation();
    this.setState({
      index: this.state.index >= this.props.images.length - 1 ?
        0 : this.state.index + 1
    });
  },

  prev: function(event) {
    event.stopPropagation();
    this.setState({
      index: this.state.index <= 0 ?
        this.props.images.length - 1 : this.state.index - 1
    });
  },

  click: function(event) {
    if (this.props.enlarged) {
      return this.next(event);
    }
  },

  render: function() {
    if (!this.image()) {return null;}
    var classes = this.classes();
    var styles = this.styles();
    return (
      <aside className={classes} style={styles}>
        <div className="b-aside-gallery">
          <Image
            src={this.src()}
            alt={this.image().alt}
            height={this.height()}
            width={this.width()}
            onClick={this.click}
          />
          <p className="b-aside-component-context">
            <span
              className="b-aside-component-button is-prev"
              onClick={this.prev}
            />
            <span className="b-aside-component-text">{this.image().text}</span>
            <span
              className="b-aside-component-button is-next"
              onClick={this.next}
            />
          </p>
        </div>
      </aside>
    );
  }

});


var AsideItem = React.createClass({

  mixins: [
    PureRenderMixin
  ],

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

  asides: {
    'image': AsideImage,
    'gallery': AsideGallery
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

  isEnlargeable: function() {
    if (_.has(this.props, 'is_enlargeable')) {
      return this.props.is_enlargeable;
    } else {
      return true;
    }
  },

  classes: function() {
    return cx({
      'b-aside-list-item': true,
      'is-enlarged': this.state.enlarged
    });
  },

  styles: function() {
    var el = document.getElementById(this.props.target);
    return {
      top: this.state.enlarged ? this.state.scrollY: el ? el.offsetTop : 0,
      position: 'absolute'
    };
  },

  aside: function(context) {
    if (!_.has(this.asides, this.props.type)) {
      throw 'Invalid aside type ' + this.state.type;
    }
    return this.asides[this.props.type](_.extend({
      enlarged: this.state.enlarged,
    }, this.props));
  },

  render: function() {
    return (
      <li
        className={this.classes()}
        style={this.styles()}
        onClick={this.isEnlargeable() ? this.enlarge : undefined}>
          {this.aside()}
      </li>
    );
  }

});

var AsideList = React.createClass({

  mixins: [
    PureRenderMixin
  ],

  items: function() {
    var item = {};
    this.props.page.get('asides').forEach(function(aside) {
      item[aside.get('target')] = AsideItem(aside.toObject());
    });
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
    StoreWatchMixin('article'),
    PureRenderMixin
  ],

  getStateFromFlux: function() {
    return {
      page: this.getFlux().store('article').page,
    };
  },

  render: function() {
    if (this.state.page) {
      return (
        <div className="b-aside is-initialized">
          <AsideList page={this.state.page} />
        </div>
      );
    } else {
      return (
        <div className="b-aside is-initialized" />
      );
    }
  }

});

module.exports = Aside;
