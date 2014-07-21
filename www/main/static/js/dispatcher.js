var _ = require('underscore');
var Dispatcher = require('flux-dispatcher');
var constants = require('./constants');


_.extend(Dispatcher.prototype, {

  view: function(payload) {
    this.dispatch(_.extend(payload, {
      source: constants.SOURCE.VIEWS,
    }));
  },

  route: function(payload) {
    this.dispatch(_.extend(payload, {
      source: constants.SOURCE.ROUTERS,
    }));
  },

});

module.exports = new Dispatcher();
