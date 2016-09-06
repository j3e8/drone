var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('js', function() {
  gulp.src(['js/main.js', 'js/**/*.js', 'pages/**/*.js', 'components/**/*.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('css', function() {
  gulp.src(['js/main.css', 'css/**/*.css', 'pages/**/*.css', 'components/**/*.css'])
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.start('js');
  gulp.start('css');
  
  watch([
    'js/**/*.js', 'pages/**/*.js', 'components/**/*.js'
  ], function() {
    gulp.start('js');
  });

  watch([
    'css/**/*.css', 'pages/**/*.css', 'components/**/*.css'
  ], function() {
    gulp.start('css');
  });
});