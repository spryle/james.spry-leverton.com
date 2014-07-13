var _ = require('underscore');


function applyID(el) {
  var doc = {};
  var count = {};
  _.each(el.children, function(block) {
    var tag = block.tagName.toLowerCase();
    count[tag] = _.isUndefined(count[tag]) ? 0 : count[tag];
    var id = tag + '-' + count[tag];
    block.setAttribute('id', id);
    count[tag]++;
    var rect = block.getBoundingClientRect();
    doc[id] = {
      top: rect.top + document.documentElement.scrollTop,
      left: rect.left + document.documentElement.scrollLeft,
      height: block.outerHeight
    };
  });
  return doc;
}


module.exports = {

  initialize: function(mount, data) {
    data.positions = applyID(mount);
  },

  render: function(data) {
    data.positions = applyID(mount);
  }

};
