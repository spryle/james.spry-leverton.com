/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react/addons').addons.classSet;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var DirectoryItemText = React.createClass({

  mixins: [
    FluxChildMixin,
    PureRenderMixin
  ],

  change: function(event) {
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
    this.getFlux().actions.path.change(this.props.path);
  },

  render: function() {
    if (this.props.current) {
      return (
        <span className='b-directory-item-text'>{this.props.content}</span>
      );
    } else {
      return (
        <a
          className='b-directory-item-text'
          onClick={this.change}
          href={this.props.path}>
          {this.props.content}
        </a>
      );
    }
  }
});


var DirectoryItem = React.createClass({

  mixins: [
    FluxChildMixin,
    PureRenderMixin
  ],

  isCurrent: function() {
    return false;
  },

  classes: function() {
    return cx({
      'b-directory-item': true,
      'is-directory': this.props.is_directory,
      'is-file': this.props.is_file,
      'is-current': this.props.current,
      'is-first': this.props.index === 0
    });
  },

  render: function() {
    return (
      <li className={this.classes()} >
        <span className="b-directory-item-content">
          <DirectoryItemText
            current={this.props.current}
            path={this.props.path}
            content={this.props.content}
          />
        </span>
      </li>
    );
  }

});

var DirectoryListing = React.createClass({

  mixins: [
    FluxChildMixin,
    PureRenderMixin
  ],

  items: function() {
    var item = [];
    this.props.index.get('children').forEach(_.bind(function(node, index) {
      item.push(DirectoryItem(_.extend(node.toObject(), {
        key: node.get('path'),
        content: node.get('name'),
        current: node.get('path') === this.props.page.get('path'),
        index: this.props.index.get('level') === 0 ? index : index + 1
      })));
    }, this));
    if (this.props.index.get('level') > 0) {
      item.unshift(DirectoryItem(_.extend(this.props.index.toObject(), {
        key: this.props.index.get('parent').get('path'),
        path: this.props.index.get('parent').get('path'),
        content: 'Back',
        index: 0
      })));
    }
    return item;
  },

  render: function() {
    return (
      <ul className="b-directory-listing">
        {this.items()}
      </ul>
    );
  }

});

var Directory = React.createClass({

  mixins: [
    FluxMixin,
    StoreWatchMixin('article', 'directory'),
    PureRenderMixin
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      page: flux.store('article').page,
      index: flux.store('directory').index
    };
  },

  render: function() {
    return (
      <div
        className="b-directory is-initialized"
        data-level={this.state.index.get('level')}>
        <DirectoryListing
         page={this.state.page}
         index={this.state.index}
        />
      </div>
    );
  }

});


module.exports = Directory;
