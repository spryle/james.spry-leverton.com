module.exports = function(func) {
  var result = func();
  if (result) {
    window[func.id] = result;
  }
  return result;
};
