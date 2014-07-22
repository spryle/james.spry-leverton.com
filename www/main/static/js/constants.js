var keyMirror = require('react/lib/keyMirror');

module.exports = {
  SOURCE: keyMirror({
    VIEWS: null,
    ROUTERS: null
  }),
  ACTIONS: keyMirror({
    PAGE_CHANGE: null,
    PAGE_UPDATE: null,
    INDEX_CHANGE: null,
    INDEX_UPDATE: null
  })
};
