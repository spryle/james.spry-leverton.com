
var dom = require('../dom.js');

module.exports = {
  initialize: function(mount) {
    mount.addEventListener('click', function() {
      dom.toggleClass(document.body, 'is-pushed');
    });
    return this;
  },

  render: function(data) {
    return this;
  }
};
