/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var cx = require('react-classset');


var DirectoryItemText = React.createClass({

  render: function() {
    if (this.props.isCurrentPage) {
      return (
        <span className='b-directory-item-text'>{this.props.content}</span>
      );
    } else {
      return (
        <a className='b-directory-item-text' href={this.props.path}>
          {this.props.content}
        </a>
      );
    }
  }
});


var DirectoryItem = React.createClass({

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

  render: function() {
    return (
      <div className="b-directory" data-level={this.props.index.level} >
        <DirectoryListing index={this.props.index}/>
      </div>
    );
  }

});


module.exports = Directory;
