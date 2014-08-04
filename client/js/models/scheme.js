var _ = require('underscore');
var State = require('ampersand-state');
var Scheme = require('color-scheme');
var gradient = require('gradient');
var color = require('color');


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
      default: 1
    },
    scheme: {
      type: 'string',
      default: 'mono',
      values: SCHEMES
    },
    distance: {
      type: 'number',
      default: 0.3
    },
    variation: {
      type: 'string',
      default: 'pastel',
      values: VARIATIONS
    }
  },

  randomize: function() {
    this.hue = _.random(1, 360);
    this.scheme = choice(SCHEMES);
    this.distance = _.random(30, 70) / 100;
    this.variation = choice(VARIATIONS);
    return this;
  },

  colors: function() {
    var scheme = new Scheme();
    scheme.from_hue(this.hue);
    scheme.scheme(this.scheme);
    scheme.distance(this.distance);
    scheme.variation(this.variation);
    return scheme.colors();
  },

  generate: function() {
    return _.map(this.colors(), function(c) {
      c = color('#' + c);
      return {
        gradients: gradient(
          c.rgbString(),
          c.darken(0.3).rgbString(),
          c.darken(0.6).rgbString(),
          20
        ).toArray('hexString'),
        additive: true
      };
    });
  }

});
