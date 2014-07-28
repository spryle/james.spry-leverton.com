/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var toggle = require('../contrib/el/toggle-class');


var SidebarTab = React.createClass({

  toggle: function() {
    toggle(document.body, 'is-pushed');
  },

  render: function() {
    return (
      <div className="b-sidebar-tab t-border g-column" onClick={this.toggle}>
         <span className="b-sidebar-burger"></span>
      </div>
    );
  }

});


module.exports = SidebarTab;
