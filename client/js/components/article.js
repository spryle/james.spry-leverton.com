/**
 * @jsx React.DOM
 */
var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var constants = require('../constants');


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

  mixins: [
    FluxMixin,
    StoreWatchMixin('article')
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      page: flux.store('article').state.getCurrentPage(),
    };
  },

  render: function() {
    if (this.state.page) {
      return (
        <div className="b-article is-initialized">
          <ArticleHeader title={
            this.state.page.title || (
              this.state.page.status_code || 'Ooops!')
          } />
          <ArticleBody content={
            this.state.page.content || (
              this.state.page.status_message ||
                this.state.page.status_code === 0 ?
                  'Having connection Issues.' :
                  '')
          } />
          <ArticleFooter
            name={this.state.page.author_name}
            email={this.state.page.author_email}
            hash={this.state.page.author_hash}
            modified={this.state.page.date_modified}
            added={this.state.page.date_added} />
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
