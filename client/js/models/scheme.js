var _ = require('underscore');
var State = require('ampersand-state');


function choice(choices) {
  return choices[_.random(0, choices.length - 1)];
}

var SCHEMES = [
  'mono',
  // 'contrast',
  // 'tetrade',
  'analogic',
  // 'triade'
];

var VARIATIONS = [
  'pastel',
  'soft',
  // 'light',
  'pale',
  // 'hard'
];

module.exports = State.extend({

  props: {
    hue: {
      type: 'number',
      default: function() { return  _.random(1, 360); },
    },
    scheme: {
      type: 'string',
      default: function() { return choice(SCHEMES); },
      values: SCHEMES
    },
    distance: {
      type: 'number',
      default: function() { return _.random(30, 70) / 100; }
    },
    variation: {
      type: 'string',
      default: function() { return choice(VARIATIONS); },
      values: VARIATIONS
    }
  },

  randomize: function() {
    this.hue = _.random(1, 360);
    this.scheme = choice(SCHEMES);
    this.distance = _.random(30, 70) / 100;
    this.variation = choice(VARIATIONS);
    return this;
  }

});
