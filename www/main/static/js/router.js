var Router = require('ampersand-router');
var dispatcher = require('./dispatcher');
var constants = require('./constants');

module.exports = Router.extend({

  routes: {
    '': 'index',
    '/': 'index',
    '(:filename)': 'page',
    '*path/': 'index',
    '*path/(:filename)': 'page',
  },

  page: function (path, filename) {
    dispatcher.route({
      type: constants.ACTIONS.PAGE_CHANGE,
      path: path && filename ?  '/' + path + '/' + filename : '/' + path
    });
  },

  index: function(path) {
    dispatcher.route({
      type: constants.ACTIONS.INDEX_CHANGE,
      path: path ?  '/' + path + '/' : '/'
    });
  }

});
