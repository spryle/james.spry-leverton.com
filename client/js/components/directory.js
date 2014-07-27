/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react-classset');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var DirectoryItemText = React.createClass({

  mixins: [
    FluxChildMixin
  ],

  change: function(event) {
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
    this.getFlux().actions.path.change(this.props.path);
  },

  render: function() {
    if (this.props.isCurrentPage) {
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
    FluxChildMixin
  ],

  isCurrent: function() {
    return false;
  },

  classes: function() {
    return cx({
      'b-directory-item': true,
      'is-directory': this.props.is_directory,
      'is-file': this.props.is_file,
      'is-current': this.props.isCurrentPage,
      'is-first': this.props.index === 0
    });
  },

  render: function() {
    return (
      <li className={this.classes()} >
        <span className="b-directory-item-content">
          <DirectoryItemText
            isCurrentPage={this.props.isCurrentPage}
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
    FluxChildMixin
  ],

  items: function() {
    var item = [];
    this.props.index.children.each(_.bind(function(node, index) {
      item.push(DirectoryItem(_.extend(node.toJSON(), {
        key: node.path,
        content: node.name,
        isCurrentPage: node.isCurrentPage,
        index: this.props.index.level === 0 ? index : index + 1
      })));
    }, this));
    if (this.props.index.level > 0) {
      item.unshift(DirectoryItem(_.extend(this.props.index.toJSON(), {
        key: this.props.index.parent.path,
        path: this.props.index.parent.path,
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
    StoreWatchMixin('ArticleStore', 'DirectoryStore')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      index: flux.store('DirectoryStore').state.getCurrentIndex(),
    };
  },

  render: function() {
    return (
      <div className="b-directory" data-level={this.state.index.level} >
        <DirectoryListing index={this.state.index}/>
      </div>
    );
  }

});


module.exports = Directory;
