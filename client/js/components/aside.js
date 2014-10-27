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
var KeyboardMixin = require('../mixins/keyboard-mixin');
var KeyboardChildMixin = require('../mixins/keyboard-child-mixin');
var Image = require('./image');
var constants = require('../constants');


var AsideImage = React.createClass({

  mixins: [
    PureRenderMixin,
    KeyboardChildMixin
  ],

  classes: function() {
    return cx({
      'b-aside-component': true
    });
  },

  width: function() {
    return this.props.enlarged ? 550: 200;
  },

  src: function() {
    return image(this.props.src, {
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
    return (
      <aside className={this.classes()}>
        <div className="b-aside-image">
          <Image
            src={this.src()}
            alt={this.props.alt}
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
    PureRenderMixin,
    KeyboardChildMixin
  ],

  componentDidMount: function() {
    this.getKeyboard().on('left', this.prev, this);
    this.getKeyboard().on('right', this.next, this);
    this.getKeyboard().on('tab', this.next, this);
  },

  componentWillUnmount: function() {
    this.getKeyboard().off('left', this.prev);
    this.getKeyboard().off('right', this.next);
    this.getKeyboard().off('tab', this.next);
  },

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

  width: function() {
    return this.props.enlarged ? 550: 200;
  },

  image: function() {
    return this.props.images.get(this.index()).toObject();
  },

  src: function() {
    return image(this.image().src, {
      w: this.width()
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
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      index: this.state.index >= this.props.images.length - 1 ?
        0 : this.state.index + 1
    });
  },

  prev: function(event) {
    event.preventDefault();
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
    return (
      <aside className={this.classes()}>
        <div className="b-aside-gallery" onClick={this.click}>
          <Image
            src={this.src()}
            alt={this.image().alt}
            width={this.width()}
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
    PureRenderMixin,
    KeyboardChildMixin
  ],

  getInitialState: function() {
    return {
      enlarged: false
    };
  },

  componentDidMount: function() {
    this.getKeyboard().on('esc', this.close, this);
  },

  componentWillUnmount: function() {
    this.getKeyboard().off('esc', this.close, this);
  },

  asides: {
    'image': AsideImage,
    'gallery': AsideGallery
  },

  close: function(event) {
    if (this.state.enlarged) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.setState({
      enlarged: false
    });
  },

  toggle: function() {
    this.setState({
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
      'is-enlargeable': this.isEnlargeable(),
      'is-enlarged': this.state.enlarged
    });
  },

  styles: function() {
    var el = document.getElementById(this.props.target);
    var width = this.state.enlarged ? 550 : 200;
    return {
      top: this.state.enlarged ?  window.scrollY : el ? el.offsetTop : 0,
      left: this.state.enlarged ? (window.screen.width - width) / 2 : null,
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
        onClick={this.isEnlargeable() ? this.toggle : undefined}>
          {this.aside()}
      </li>
    );
  }

});

var AsideList = React.createClass({

  mixins: [
    PureRenderMixin,
    KeyboardChildMixin
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
    PureRenderMixin,
    KeyboardMixin
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
