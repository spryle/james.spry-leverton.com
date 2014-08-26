var keyMirror = require('react/lib/keyMirror');

module.exports = {

  ACTIONS: keyMirror({

    PATH_CHANGE: null,

    ARTICLE_LOADED: null,
    ARTICLE_FAILED: null,

    DIRECTORY_LOADED: null,
    DIRECTORY_FAILED: null,

    SITE_WAITING: null
  })

};
