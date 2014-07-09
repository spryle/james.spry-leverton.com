/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react');


var AsideImage = React.createClass({

  render: function() {
    return (
      <aside className="b-aside-component">
        <img  src={this.props.src} alt={this.props.alt} />
      </aside>
    )
  }

});

var AsideItem = React.createClass({

  render: function() {
    var styles = {
      position: 'absolute',
      top: this.props.pos.top
    }
    return (
      <li className="b-aside-list-item" style={styles}>
        <AsideImage src={this.props.data.src} alt={this.props.data.alt} />
      </li>
    )
  }

})

var AsideList = React.createClass({

  render: function() {
    var item = {};
    _.each(this.props.asides, _.bind(function(data, id) {
      item[id] = AsideItem({
        id: id,
        data: data,
        pos: this.props.article[id]
      });
    }, this));
    return <ol className="b-aside-list">{item}</ol>
  }

});

module.exports = function(mount, data) {
  return React.renderComponent(
    <AsideList asides={data.context.asides} article={data.article}/>,
    mount.get(0)
  );
};
