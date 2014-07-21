/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');

var SidebarSubTitle = React.createClass({

  render: function() {
    var partial;
    if (this.props.href) {
      partial = <a href={this.props.href}>{this.props.text}</a>;
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


  render: function() {
    return (
      <header className="b-sidebar-header">
        <h2 className="b-sidebar-title t-logo">
          <a href="">
            <span className="b-sidebar-firstname">James</span> Spry-Leverton
          </a>
        </h2>
        <SidebarSubTitle
          href={this.props.index.path || null}
          text={this.props.index.name || 'Web Developer, London'}
        />
      </header>
    );
  }

});


module.exports = SidebarHeader;
