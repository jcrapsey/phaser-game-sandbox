var gulp       = require('gulp');
var clean      = require('gulp-clean');
var connect    = require('connect');
var http       = require('http');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var glob       = require('glob');
var path       = require('path');
var Q          = require('q');

gulp.task('clean:dist:project', function(){
  return gulp.src([
    'dist/**/*',
    '!dist/third_party',
    '!dist/third_party/**/*'
  ]).pipe(clean());
});

gulp.task('clean:dist:bower', function(){
  return gulp.src('dist/third_party').pipe(clean());
});

gulp.task('copy:dist:project', ['clean:dist:project'], function(){
  return gulp.src([
    'src/**/*',
    '!src/**/*.js'
  ], {base: 'src'})
  .pipe(gulp.dest('dist'));
});

gulp.task('move:bower', ['clean:dist:bower'], function(){
  [
    {files: 'phaser/phaser.js', dest: 'phaser'},
    {files: 'phaser/phaser.map', dest: 'phaser'}
  ].forEach(function(path){
    gulp.src('bower_components/'+path.files)
    .pipe(gulp.dest('dist/third_party/'+path.dest))
  });
});

gulp.task('http:dist', function(){
  var port = process.env.PORT || 3000;
  console.log('server on port '+port);
  var app = connect()
  .use(connect.static('dist'));
  http.createServer(app).listen(port);
});

gulp.task('make:dist', [
  'clean:dist:project',
  'clean:dist:bower',
  'copy:dist:project',
  'move:bower'
]);