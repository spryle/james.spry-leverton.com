var _ = require('underscore');


module.exports = function(el) {
  var article = {};
  var count = {};
  _.each(el.children, function(block) {
    var tag = block.tagName.toLowerCase();
    count[tag] = _.isUndefined(count[tag]) ? 0 : count[tag];
    var id = tag + '-' + count[tag];
    block.setAttribute('id', id);
    count[tag]++;
    var rect = block.getBoundingClientRect();
    article[id] = {
      top: rect.top + document.documentElement.scrollTop,
      left: rect.left + document.documentElement.scrollLeft,
      height: block.outerHeight
    };
  });
  return article;
};
