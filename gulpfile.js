var gulp       = require('gulp');
var clean      = require('gulp-clean');
var connect    = require('connect');
var http       = require('http');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var glob       = require('glob');
var path       = require('path');
var Q          = require('q');

var browserifyProjects = function(dest){
  var bStreams = [];
  glob("src/*/index.js", function (err, files){
    files.forEach(function(file_path){
      var bStream, src_path, dst_path;
      // remove root directory and file from path
      file_path = file_path
        .split(path.sep)
        .splice(1)
        .slice(0, -1)
        .join(path.sep);

      src_path = path.join(__dirname, 'src', file_path);
      dst_path = path.join(__dirname, dest, file_path);

      bStream = browserify(src_path)
        .bundle({debug: true})
        .pipe(source('index.js'))
        .pipe(gulp.dest(dst_path));

      bStreams.push(bStream);
    });
  });
  return Q.when(bStreams);
};

var copyBowerAssets = function(dest){
  [
    {files: 'phaser/phaser.js', dest: 'phaser'},
    {files: 'phaser/phaser.map', dest: 'phaser'}
  ].forEach(function(bower_path){
    gulp.src(path.join('bower_components', bower_path.files))
    .pipe(gulp.dest(path.join(dest,'third_party', bower_path.dest)))
  });
};

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

gulp.task('browserify:dist', ['copy:dist:project'], function(){
  return browserifyProjects('dist');
});

gulp.task('copy:dist:bower', ['clean:dist:bower'], function(){
  return copyBowerAssets('dist');
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
  'copy:dist:bower',
  'browserify:dist'
]);
