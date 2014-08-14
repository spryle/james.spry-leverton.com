var _ = require('underscore');
var Fluxxor = require('fluxxor');
var PagesCollection = require('../collections/pages.js');
var Immutable = require('immutable');
var constants = require('../constants');


function isIndex(path) {
  return _.last(path) === '/';
}

var actions = {};
actions[constants.ACTIONS.PATH_CHANGE] = 'path';
actions[constants.ACTIONS.ARTICLE_LOADED] = 'update';
actions[constants.ACTIONS.ARTICLE_FAILED] = 'update';


module.exports = Fluxxor.createStore({

  initialize: function(initial) {
    this.pages = new PagesCollection(initial);
    this.page = Immutable.fromJS(this.pages.getCurrentPage().toJSON());
  },

  actions: actions,

  response: function(model, resp, options) {
    model.status_code = options.xhr.statusCode;
    model.status_message = options.xhr.statusMessage;
  },

  success: function(model, resp, options) {
    this.response(model, resp, options);
    this.flux.actions.article.loaded(model.path);
  },

  error: function(model, resp, options) {
    this.response(model, resp, options);
    this.flux.actions.article.failed(model.path);
  },

  update: function() {
    this.page = Immutable.fromJS(this.pages.getCurrentPage().toJSON());
    this.emit('change');
  },

  path: function(path) {
    if (isIndex(path)) {
      path = path + 'index';
    }
    var page = this.pages.get(path);
    if (page && page.status_code === 200) {
      return _.defer(this.flux.actions.article.loaded, page.path);
    }
    this.pages.add({path: path}).fetch({
      success: this.success,
      error: this.error
    });
  }

});
