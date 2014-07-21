var keyMirror = require('react/lib/keyMirror');

module.exports = {
  SOURCE: keyMirror({
    VIEWS: null,
    ROUTERS: null
  }),
  ACTIONS: keyMirror({
    PAGE_CHANGE: null,
    INDEX_CHANGE: null
  })
};
