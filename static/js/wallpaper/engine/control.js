var _ = require('underscore');

var Control = function(engine, screen, options) {
  this.engine = engine;
  this.screen = screen;
  this.options = options || {};
  this.running = false;
  this.elapsed = 0;
};

_.extend(Control.prototype, {

  start: function() {
    this.running = true;
    var run = _.wrap(_.bind(this.update, this), _.bind(function(update) {
      if (!this.running) {return;}
      var time;
      var delay;
      var remaining;
      var start;
      var end;

      start = new Date().getTime();
      update.apply(this, Array.prototype.slice.call(arguments, 1));
      end = new Date().getTime();
      this.elapsed = end - start;

      if (this.options.tick) {
        remaining = this.options.tick - this.elapsed;
        time = (this.elapsed < this.options.tick ? this.options.tick: this.elapsed) / 1000;
        delay = remaining < 0 ? 0 : remaining;
      } else {
        time = this.elapsed / 1000;
        delay = 0;
      }
      _.delay(run, delay, time);

    }, this));
    run(0);
    return this;
  },

  render: function() {
    this.start();
    this.stop();
    return this;
  },

  stop: function() {
    this.running = false;
    return this;
  },

  update: function(time) {
    this.engine.update(time);
    this.screen.render(this.engine.entities);
  },

  fps: function() {
    return this.elapsed ? 1000 / this.elapsed : 0;
  }
});

module.exports = Control;
