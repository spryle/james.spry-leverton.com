module.exports = function(path) {
  if (window.location.pathname.slice(-1) === '/') {
    return window.location.pathname + 'index' === path;
  } else {
    return window.location.pathname === path;
  }
};
