// Config
var paths = {
  entry: './src/js/main.js',
  allJS: './src/js/**/*.js',
  allCSS: './src/css/**/*.styl',
  html: './src/index.html',
  outJS: './build/js',
  outCSS: './build/css',
  outHTML: './build'
}

var pkg = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var path = require('path');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var jeet = require('jeet');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var minifyCss = require('gulp-minify-css');
var replace = require('gulp-replace');
var fs = require('fs');

// Browserify
var bundler = browserify({
  entries: paths.entry,
  extensions: ['.js'],
  debug: true
})
.add(require.resolve('babel/polyfill'));

bundler.transform(babelify.configure({
  sourceMaps: 'inline'
}));

var bundleScripts = function() {
  gutil.log('Bundling scripts...');
  return bundler
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(paths.outJS))
    .on('error', function (err) {
      gutil.log(err.message);
      this.emit('end');
    });
}

gulp.task('build', ['build:js', 'build:css', 'build:html']);

gulp.task('build:js', function() {
  bundleScripts();
});

gulp.task('build:css', function() {
  gulp.src('./src/css/main.styl')
    .pipe(stylus({
      include: ['bower_components'],
      'include css': true,
      use: [jeet()]
    }))
    .pipe(concat('bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.outCSS))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:html', function() {
  gulp.src(paths.html)
    .pipe(gulp.dest(paths.outHTML));
});

gulp.task('watch', ['watch:js', 'watch:css', 'watch:html']);

gulp.task('watch:js', ['build:js'], function() {
  var watcher = watchify(bundler);
  watcher.on('update', function() {
    bundleScripts();
    browserSync.reload({stream: true, once: true});
  });
});

gulp.task('watch:css', ['build:css'], function() {
  gulp.watch(paths.allCSS, ['build:css']);
});

gulp.task('watch:html', ['build:html'], function() {
  gulp.watch(paths.html, ['build:html']);
});

gulp.task('test', ['watch'], function() {
  browserSync({
    server: './build'
  });
});

gulp.task('distribute:html', function() {
  var scripts = fs.readFileSync('./build/js/bundle.js');
  var styles = fs.readFileSync('./build/css/bundle.css');

  gulp.src('./build/index.html')
    .pipe(replace('{storyName}', '{{STORY_NAME}}'))
    .pipe(replace('{styles}', styles))
    .pipe(replace('{storyData}', '{{STORY_DATA}}'))
    .pipe(replace('{scripts}', scripts))
    .pipe(gulp.dest('./dist'));
});

gulp.task('distribute:js', function() {
  var format = require('./src/format.json');
  format.source = fs.readFileSync('./dist/index.html', {encoding: 'utf8'});

  fs.writeFile('./dist/format.js', 'window.storyFormat(' + JSON.stringify(format) + ');');
  if (format.image) {
    gulp.src(path.join('./src', format.image))
      .pipe(gulp.dest('./dist'));
  }
});

gulp.task('distribute', ['build', 'distribute:html', 'distribute:js']);