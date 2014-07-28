var State = require('ampersand-state');


var Aside = State.extend({

  props: {
    target: 'string',
    src: 'string',
    alt: 'string',
    title: 'string',
    text: 'string',
    type: 'string',
    images: 'array'
  }

});

module.exports = Aside;
