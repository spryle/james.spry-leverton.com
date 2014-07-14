var State = require('ampersand-state');
var Collection = require('ampersand-collection');


var Aside = State.extend({

  props: {
    target: 'string',
    src: 'string',
    alt: 'string',
    title: 'string',
    text: 'string',
    type: 'string'
  }

});

var Asides = Collection.extend({

  mainIndex: 'target',
  model: Aside

});

var Page = State.extend({

  props: {
    name: 'string',
    url: 'string',
    author: 'string',
    title: 'string',
    content: 'string',
    extension: 'string',
    is_directory: 'boolean',
    is_indexable: 'boolean',
    is_file: 'boolean',
    is_hidden: 'boolean',
    is_renderable: 'boolean',
    is_parseable: 'boolean',
    tags: 'array',
    date_added: 'date',
    date_modified: 'date',
    positions: 'object'
  },

  children: {
    asides: Asides
  }


});


module.exports = {
  Page: Page
};
