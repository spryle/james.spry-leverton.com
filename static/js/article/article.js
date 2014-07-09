var _ = require('underscore');
var $ = require('jquery');

module.exports = function(el) {
  var article = {};
  var count = {};
  $(el).children().each(function() {
    var $block = $(this);
    var tag = $block.prop('tagName').toLowerCase();
    count[tag] = _.isUndefined(count[tag]) ? 0 : count[tag];
    var id = tag + '-' + count[tag];
    $block.prop('id', id);
    count[tag]++;
    article[id] = $block.offset();
    article[id].height = $block.height();
  });
  return article;
};
