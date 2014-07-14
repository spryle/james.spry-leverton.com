/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');

// function applyID(el) {
//   var doc = {};
//   var count = {};
//   _.each(el.children, function(block) {
//     var tag = block.tagName.toLowerCase();
//     count[tag] = _.isUndefined(count[tag]) ? 0 : count[tag];
//     var id = tag + '-' + count[tag];
//     block.setAttribute('id', id);
//     count[tag]++;
//     doc[id] = {
//       top: block.offsetTop,
//       left: block.offsetLeft,
//       height: block.offsetHeight
//     };
//   });
//   return doc;
// }

var ArticleHeader = React.createClass({

  render: function() {
    return (
      <header className="b-article-header">
        <h1>{this.props.title}</h1>
      </header>
    );
  }

});

var ArticleBody = React.createClass({

  render: function() {
    return (
      <div
        className="b-article-body"
        dangerouslySetInnerHTML={__html=this.props.content}
      />
    );
  }

});

var ArticleFooter = React.createClass({

  render: function() {
    return (
      <footer className="b-article-footer t-tertiary g-clearfix">
        <div className="b-article-date"></div>
        <div className="b-article-author-gravitar"></div>
        <div className="b-article-author"></div>
      </footer>
    );
  }

});


var Article = React.createClass({

  render: function() {
    return (
      <div className="b-article">
        <ArticleHeader title={this.props.page.title} />
        <ArticleBody content={this.props.page.content} />
        <ArticleFooter
          author={this.props.page.author}
          modified={this.props.page.date_modified}
          updated={this.props.page.date_updated} />
      </div>
    );
  }

});

module.exports = Article;
