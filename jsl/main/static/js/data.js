var data = window.jsl;

try {
  delete window.jsl;
} catch(e) {
  window.jsl = undefined;
}

if (Object.freeze) {
  Object.freeze(data);
}

module.exports = data;

