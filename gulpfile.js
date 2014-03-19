var pkg        = require('./package.json');
var gulp       = require('gulp')
var karma      = require('gulp-karma')
var concat     = require('gulp-concat')
var header     = require('gulp-header')
var compiler   = require('gulp-closure-compiler')
var transpiler = require('gulp-es6-module-transpiler')

var paths = {
  src: [
    'lib/base.js',
    'lib/dom.js'
  ],
  test: [
    'dist/lib/**/*.js',
    'test/**/*_test.js'
  ]
}

gulp.task('build', function() {
  return gulp.src(paths.src)
             .pipe(transpiler({ type: "globals", imports: "lib" }))
             .pipe(gulp.dest("./dist/lib"))
             .pipe(concat("cohesive.js"))
             .pipe(gulp.dest("./dist/"))
})

gulp.task('karma', ['build'], function() {
  gulp.src(paths.test)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
})

gulp.task('test', ['build'], function() {
  gulp.src(paths.test)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      browsers:["Chrome", "Firefox", "PhantomJS"]
    }));
})

gulp.task('default', ['build', 'karma'], function() {
  gulp.watch(paths.src, ['build'])
})
