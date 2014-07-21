var Router = require('ampersand-router');
var dispatcher = require('./dispatcher');

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
      type: 'PAGE_CHANGE',
      path: path && filename ?  '/' + path + '/' + filename : '/' + path
    });
  },

  index: function(path) {
    dispatcher.route({
      type: 'INDEX_CHANGE',
      path: path ?  '/' + path + '/' : '/'
    });
  }

});
