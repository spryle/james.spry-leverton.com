/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var moment = require('moment');
var React = require('react');


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
        dangerouslySetInnerHTML={{__html: this.props.content}}
      />
    );
  }

});


var ArticleAuthor = React.createClass({

  render: function() {
    return (
      <div className="b-article-author">
        <div className="b-article-author-name">{this.props.name}</div>
        <div className="b-article-author-email">{this.props.email}</div>
      </div>
    );
  }

});


var ArticleGravitar = React.createClass({

  src: function() {
    return 'http://www.gravatar.com/avatar/' + this.props.hash + '?s=60';
  },

  render: function() {
    return (
      <div className="b-article-gravitar">
        <img src={this.props.hash ? this.src() : undefined} />
      </div>
    );
  }

});

var ArticleDate = React.createClass({

  modified: function() {
    return this.props.modified ?
      moment(this.props.modified).format('Do MMMM YYYY') : '';
  },

  added: function() {
    return this.props.added ?
      moment(this.props.added).format('Do MMMM YYYY') : '';
  },

  render: function() {

    return (
      <div className="b-article-date">
        <div className="b-article-date-added">
          {this.props.added ? 'Published ' + this.added() : ''}
        </div>
        <div className="b-article-date-added">
          {this.props.modified ? 'Updated ' + this.modified() : ''}
        </div>
      </div>
    );
  }

});

var ArticleFooter = React.createClass({

  render: function() {
    return (
      <footer className="b-article-footer t-tertiary g-clearfix">
        <ArticleDate
          modified={this.props.modified}
          added={this.props.added}
        />
        <ArticleGravitar
          hash={this.props.hash}
        />
        <ArticleAuthor
          name={this.props.name}
          email={this.props.email}
        />
      </footer>
    );
  }

});


var Article = React.createClass({

  render: function() {
    return (
      <div className="b-article is-initialized">
        <ArticleHeader title={this.props.page.title} />
        <ArticleBody content={this.props.page.content} />
        <ArticleFooter
          name={this.props.page.author_name}
          email={this.props.page.author_email}
          hash={this.props.page.author_hash}
          modified={this.props.page.date_modified}
          added={this.props.page.date_added} />
      </div>
    );
  }

});

module.exports = Article;
