var addClass = require('./el/add-class');
var removeClass = require('./el/remove-class');


module.exports = function() {
  removeClass(this, 'is-awaiting-mount');
  addClass(this, 'is-mounted');
};
