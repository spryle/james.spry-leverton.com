var State = require('ampersand-state');


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
    asides: 'object',
    positions: 'object'
  }

});


module.exports = {
  Page: Page
};
