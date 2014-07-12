var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var refresh = require('gulp-livereload');
var less = require('gulp-less');
var shell = require('gulp-shell');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var rename = require('gulp-rename');

var root = './jsl/main/static/';

var src = {
  scripts: {
    init: root + 'js/init.js',
    files: [
      root + 'js/**/*.js',
      './node_modules/tarka/**/*.js',
    ]
  },
  styles: {
    init: root + 'less/init.less',
    files: [
      root + 'less/**/*.less',
      '../content.spry-leverton.com/**/*'
    ]
  },
  templates: {
    files: [
      './templates/**/*.html'
    ]
  }
};

var dest = {
  scripts: root + 'dist/',
  styles: root + 'dist/',
};

function error(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
    notify.onError('<%= error.message %>')(err);
  };
}

function bundler(src, watch) {
  return watch ? watchify(src) : browserify(src);
}

gulp.task('serve', shell.task([
  'python manage.py runserver --no-reload',
]));

gulp.task('styles', function() {
  return gulp.src(src.styles.init)
    .pipe(less().on('error', error('styles')))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(dest.styles))
    .pipe(notify({title: '[Styles] CSS Ready'}));
});

gulp.task('scripts', function() {

  var bundle = bundler(src.scripts.init, true);
  bundle.transform(reactify);

  var refresh = function() {
    var stream = bundle.bundle({debug: true});
    stream.on('error', error('scripts'));
    return stream
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(dest.scripts));
      // .pipe(notify({title: '[Scripts] JS Ready'}));
  };

  bundle.on('update', refresh);
  return refresh();

});

gulp.task('watch', function() {

  var scripts = gulp.watch(src.scripts.files, ['scripts']);
  var styles = gulp.watch(src.styles.files, ['styles']);

  var server = refresh();

  scripts.on('change', function(file) {
    server.changed(file.path);
  });

  styles.on('change', function(file) {
    server.changed(file.path);
  });

});

gulp.task('default', [
  'watch',
]);


