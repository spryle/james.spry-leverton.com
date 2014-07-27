var State = require('ampersand-state');

var Site = State.extend({

  props: {
    status: {
      type: 'string',
      default: 'WAITING',
      values: ['WAITING', 'LOADING', 'UPDATED']
    }
  },

});

module.exports = Site;
