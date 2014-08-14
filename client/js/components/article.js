/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


var ArticleHeader = React.createClass({

  mixins: [
    PureRenderMixin
  ],

  render: function() {
    return (
      <header className="b-article-header">
        <h1>{this.props.title}</h1>
      </header>
    );
  }

});

var ArticleBody = React.createClass({

  mixins: [
    PureRenderMixin
  ],

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

  mixins: [
    PureRenderMixin
  ],

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

  mixins: [
    PureRenderMixin
  ],

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

  mixins: [
    PureRenderMixin
  ],

  dateAdded: function() {
    return (
      <div className="b-article-date-added">
        <span className="b-article-date-title">Published</span>
        {this.props.added}
      </div>
    );
  },

  dateModified: function() {
    if (this.props.added && this.props.modified !== this.props.added) {
      return (
        <div className="b-article-date-added">
          <span className="b-article-date-title">Updated</span>
          {this.props.modified}
        </div>
      );
    } else {
      return '';
    }
  },

  render: function() {
    return (
      <div className="b-article-date">
        {this.dateAdded()}
        {this.dateModified()}
      </div>
    );
  }

});

var ArticleFooter = React.createClass({

  mixins: [
    PureRenderMixin
  ],

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

  title: function() {
    return this.state.page.get('title') || (
      this.state.page.get('status_code') || 'Ooops!'
    );
  },

  content: function() {
    return this.state.page.get('content') || (
      this.state.page.get('status_message') ||
        this.state.page.get('status_code') === 0 ?
          'Having connection Issues.' : '');
  },

  render: function() {
    if (this.state.page) {
      return (
        <div className="b-article is-initialized">
          <ArticleHeader title={this.title()} />
          <ArticleBody content={this.content()} />
          <ArticleFooter
            name={this.state.page.get('author_name')}
            email={this.state.page.get('author_email')}
            hash={this.state.page.get('author_hash')}
            modified={this.state.page.get('date_modified_formatted')}
            added={this.state.page.get('date_added_formatted')} />
        </div>
      );
    } else {
      return (
        <div className="b-article is-initialized">
        </div>
      );
    }
  }

});

module.exports = Article;
