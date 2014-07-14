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
    console.dir(block);
    doc[id] = {
      top: block.offsetTop,
      left: block.offsetLeft,
      height: block.offsetHeight
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
