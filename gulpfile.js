var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var refresh = require('gulp-livereload');
var less = require('gulp-less');
var shell = require('gulp-shell');
var jsmin = require('gulp-jsmin');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var rename = require('gulp-rename');

var root = './client/';

var src = {
  scripts: {
    head: root + 'js/init.head.js',
    main: root + 'js/init.main.js',
    files: [
      root + 'js/**/*.js',
      './node_modules/tarka/**/*.js',
    ]
  },
  styles: {
    head: root + 'less/init.head.less',
    main: root + 'less/init.main.less',
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

external = [
  'settings',
  'data'
];

var dest = {
  scripts: './assets/js/',
  styles: './assets/css/',
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

gulp.task('main-styles', function() {
  return gulp.src(src.styles.main)
    .pipe(less().on('error', error('styles')))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(dest.styles))
    .pipe(notify({title: '[Styles] CSS Ready'}));
});

gulp.task('head-styles', function() {
  return gulp.src(src.styles.head)
    .pipe(less().on('error', error('styles')))
    .pipe(rename('head.css'))
    .pipe(gulp.dest(dest.styles))
    .pipe(notify({title: '[Styles] CSS Ready'}));
});

gulp.task('main-scripts', function() {

  var main = bundler(src.scripts.main, true);
  main.transform(reactify);
  external.forEach(function (lib) {
    main.external(lib);
  });

  var refresh = function() {
    var stream = main.bundle({debug: false});
    stream.on('error', error('scripts'));
    return stream
      .pipe(source('main.js'))
      .pipe(gulp.dest(dest.scripts));
      // .pipe(notify({title: '[Scripts] JS Ready'}));
  };

  main.on('update', refresh);
  return refresh();

});

gulp.task('head-scripts', function() {

  var head = bundler(src.scripts.head, true);
  external.forEach(function (lib) {
    head.external(lib);
  });


  var refresh = function() {
    var stream = head.bundle({debug: false});
    stream.on('error', error('scripts'));
    return stream
      .pipe(source('head.js'))
      .pipe(gulp.dest(dest.scripts));
      // .pipe(notify({title: '[Scripts] JS Ready'}));
  };

  head.on('update', refresh);
  return refresh();

});

gulp.task('build', function() {
  return gulp.src([dest.scripts + "*.js"])
    .pipe(jsmin())
    .pipe(gulp.dest(dest.scripts));
});

gulp.task('watch', function() {

  var scripts = gulp.watch(src.scripts.files, [
    'main-scripts',
    'head-scripts'
  ]);
  var styles = gulp.watch(src.styles.files, [
    'main-styles',
    'head-styles'
  ]);

  var server = refresh();

  scripts.on('change', function(file) {
    server.changed(file.path);
  });

  styles.on('change', function(file) {
    server.changed(file.path);
  });

});

gulp.task('default', [
  'main-styles',
  'head-styles',
  'main-scripts',
  'head-scripts',
  'watch',
]);


