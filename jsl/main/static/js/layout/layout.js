var dom = require('../dom.js');


module.exports = function(el) {
  el.addEventListener('click', function() {
    console.log('toggle');
    dom.toggleClass(document.body, 'is-pushed');
  });
};
