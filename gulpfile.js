var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('notify-send');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var shell = require('gulp-shell');
var jsmin = require('gulp-jsmin');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var source = require('vinyl-source-stream');
var sequence = require('run-sequence');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');


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
      root + 'less/**/*.less'
    ]
  },

  templates: {
    files: [
      './templates/**/*.html'
    ]
  }

};

var options = {

  less: {
    modifyVars: {
      'static-url': ''
    }
  }

};

var external = [
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
    notify.low.timeout(1000).notify('Error', err.message);
  };

}

function bundler(src, watch) {
  return watch ? watchify(src) : browserify(src);
}

gulp.task('runserver', shell.task([
  'CONFIG=local.cfg python manage.py runserver',
]));

gulp.task('download-media', shell.task([
  'CONFIG=local.cfg python manage.py download_media',
]));

gulp.task('sync-media', shell.task([
  'CONFIG=local.cfg python manage.py sync_media',
]));

gulp.task('sync-assets', shell.task([
  'CONFIG=local.cfg python manage.py sync_assets',
]));

gulp.task('main-styles', function() {

  return gulp.src(src.styles.main)
    .pipe(plumber())
    .pipe(less(options.less).on('error', error('styles')))
    .pipe(prefix('last 10 version'))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(dest.styles));

});

gulp.task('head-styles', function() {

  return gulp.src(src.styles.head)
    .pipe(plumber())
    .pipe(less(options.less).on('error', error('styles')))
    .pipe(prefix('last 10 version'))
    .pipe(rename('head.css'))
    .pipe(gulp.dest(dest.styles));

});

gulp.task('main-scripts', function() {

  var main = bundler(src.scripts.main, true);
  main.transform(reactify);

  external.forEach(function(lib) {
    main.external(lib);
  });

  var refresh = function() {

    var stream = main.bundle({debug: false});
    stream.on('error', error('scripts'));

    return stream
      .pipe(plumber())
      .pipe(source('main.js'))
      .pipe(gulp.dest(dest.scripts));
  };

  main.on('update', refresh);
  return refresh();

});

gulp.task('head-scripts', function() {

  var head = bundler(src.scripts.head, true);

  external.forEach(function(lib) {
    head.external(lib);
  });

  var refresh = function() {

    var stream = head.bundle({debug: false});
    stream.on('error', error('scripts'));

    return stream
      .pipe(plumber())
      .pipe(source('head.js'))
      .pipe(gulp.dest(dest.scripts));

  };

  head.on('update', refresh);
  return refresh();

});

gulp.task('minify-scripts', function() {

  var target = [
    dest.styles + '*.js',
    '!' + dest.styles + '*.min.js',
    '!' + dest.styles + '*.gz.js'
  ];

  return gulp.src(target)
    .pipe(plumber())
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest.scripts));

});

gulp.task('compress-scripts', function() {
  return gulp.src([dest.scripts + '*.min.js'])
    .pipe(plumber())
    .pipe(gzip({append: false, gzipOptions: {level: 9}}))
    .pipe(rename({suffix: '.gz'}))
    .pipe(gulp.dest(dest.scripts));
});

gulp.task('minify-styles', function() {

  var target = [
    dest.styles + '*.css',
    '!' + dest.styles + '*.min.css',
    '!' + dest.styles + '*.gz.css'
  ];

  return gulp.src(target)
    .pipe(plumber())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest.styles));

});

gulp.task('compress-styles', function() {
  return gulp.src([dest.styles + '*.min.css'])
    .pipe(plumber())
    .pipe(gzip({append: false, gzipOptions: {level: 9}}))
    .pipe(rename({suffix: '.gz'}))
    .pipe(gulp.dest(dest.styles));
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

  var server = livereload();

  scripts.on('change', function(file) {
    notify.low.timeout(1000).notify('[Scripts] CSS Ready', file.path);
    server.changed(file.path);
  });

  styles.on('change', function(file) {
    notify.low.timeout(1000).notify('[Styles] CSS Ready', file.path);
    server.changed(file.path);
  });

});

gulp.task('styles', [
  'main-styles',
  'head-styles',
]);

gulp.task('scripts', [
  'main-scripts',
  'head-scripts',
]);

gulp.task('minify', [
  'minify-scripts',
  'minify-styles',
]);

gulp.task('compress', [
  'compress-scripts',
  'compress-styles',
]);

gulp.task('build', function(callback) {
  sequence([
    'scripts',
    'styles'
  ],
  'minify',
  'compress');
});

gulp.task('serve', [
  'styles',
  'scripts',
  'runserver',
  'watch',
]);
