var constants = require('./constants');


module.exports = {

  path: {

    change: function(path) {
      this.dispatch(constants.ACTIONS.PATH_CHANGE, path);
    }

  },

  article: {

    loaded: function(path) {
      this.dispatch(constants.ACTIONS.ARTICLE_LOADED, path);
    },

    failed: function(path) {
      this.dispatch(constants.ACTIONS.ARTICLE_FAILED, path);
    }

  },

  directory: {

    loaded: function(path) {
      this.dispatch(constants.ACTIONS.DIRECTORY_LOADED, path);
    },

    failed: function(path) {
      this.dispatch(constants.ACTIONS.DIRECTORY_FAILED, path);
    }
  },

  site: {

    waiting: function() {
      this.dispatch(constants.ACTIONS.SITE_WAITING);
    }

  },

  wallpaper: {

    play: function() {
      this.dispatch(constants.ACTIONS.WALLPAPER_PLAY);
    },

    pause: function() {
      this.dispatch(constants.ACTIONS.WALLPAPER_PAUSE);
    },

    refresh: function() {
      this.dispatch(constants.ACTIONS.WALLPAPER_REFRESH);
    },

    clear: function() {
      this.dispatch(constants.ACTIONS.WALLPAPER_CLEAR);
    }

  }

};
