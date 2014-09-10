var _ = require('underscore');
var Fluxxor = require('fluxxor');
var IndexesCollection = require('../collections/indexes');
var Immutable = require('immutable');
var constants = require('../constants');


function isIndex(path) {
  return path === '' || _.last(path) === '/';
}

var actions = {};
actions[constants.ACTIONS.PATH_CHANGE] = 'path';
actions[constants.ACTIONS.DIRECTORY_LOADED] = 'update';
actions[constants.ACTIONS.DIRECTORY_FAILED] = 'update';


module.exports = Fluxxor.createStore({

  initialize: function(initial) {
    this.indexes = new IndexesCollection(initial);
    var index = this.indexes.getCurrentIndex();
    this.index = Immutable.fromJS(index ? index.toJSON() : {});
  },

  actions: actions,

  response: function(model, resp, options) {
    model.status_code = options.xhr.statusCode;
    model.status_message = options.xhr.statusMessage;
  },

  success: function(model, resp, options) {
    this.response(model, resp, options);
    this.flux.actions.directory.loaded(model.path);
  },

  error: function(model, resp, options) {
    this.response(model, resp, options);
    this.flux.actions.directory.failed(model.path);
  },

  update: function() {
    var index = this.indexes.getCurrentIndex();
    this.index = Immutable.fromJS(index ? index.toJSON() : {});
    this.emit('change');
  },

  path: function(path) {
    if (!isIndex(path)) {return;}
    var index = this.indexes.get(path);
    if (index && index.status_code === 200) {
      return _.defer(this.flux.actions.directory.loaded, index.path);
    }
    this.indexes.add({path: path}).fetch({
      success: this.success,
      error: this.error
    });
  }

});
