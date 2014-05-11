var gulp    = require('gulp');
var clean   = require('gulp-clean');
var connect = require('connect');
var http    = require('http');

gulp.task('clean:dist:project', function(){
  return gulp.src([
    'dist/**/*',
    '!dist/third_party',
    '!dist/third_party/**/*'
  ]).pipe(clean());
});

gulp.task('clean:dist:bower', function(){
  return gulp.src('dist/thrid_party').pipe(clean());
});

gulp.task('move:src', ['clean:dist:project'], function(cb){
  return gulp.src('src/**/*', {base: 'src'})
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
  var app = connect()
  .use(connect.static('dist'));
  http.createServer(app).listen(process.env.PORT || 3000);
});

gulp.task('make:dist', [
  'clean:dist:project',
  'clean:dist:bower',
  'move:src',
  'move:bower'
]);