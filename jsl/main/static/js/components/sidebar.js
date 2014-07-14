var toggle = require('../contrib/dom/toggle-class');

module.exports = {
  initialize: function(mount, stores) {
    this.stores = stores;
    mount.addEventListener('click', function() {
      toggle(document.body, 'is-pushed');
    });
    return this;
  },

  render: function(data) {
    return this;
  }
};
