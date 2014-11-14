var State = require('ampersand-state');


var Aside = State.extend({

  props: {
    target: 'string',
    src: 'string',
    alt: 'string',
    title: 'string',
    text: 'string',
    type: 'string',
    images: 'array',
    href: 'string',
    icon: 'string',
    is_enlargeable: 'boolean'
  }

});

module.exports = Aside;
