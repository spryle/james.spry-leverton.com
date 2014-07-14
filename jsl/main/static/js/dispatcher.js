var _ = require('underscore');
var Dispatcher = require('flux-dispatcher');


_.extend(Dispatcher.prototype, {

  view: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  route: function(action) {
    this.dispatch({
      source: 'ROUTE_ACTION',
      action: action
    });
  },

});

module.exports = new Dispatcher();
