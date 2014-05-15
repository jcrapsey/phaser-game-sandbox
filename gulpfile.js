var gulp       = require('gulp');
var clean      = require('gulp-clean');
var connect    = require('connect');
var http       = require('http');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var glob       = require('glob');
var path       = require('path');
var uglify     = require('gulp-uglify');
var streamify  = require('gulp-streamify');
var concat     = require('gulp-concat');

var bower_includes = [
  'phaser/phaser.js'
];
// Tasks for development directory "lib"
gulp.task('clean:lib', function(){
  return gulp.src([
    'lib/**/*'
  ]).pipe(clean());
});

gulp.task('make:lib', ['clean:lib'], function(){
  gulp.src(bower_includes, {cwd: 'bower_components'})
    .pipe(concat('third_party.js'))
    .pipe(gulp.dest('lib'));
  gulp.src(['src/**/*.*', '!src/**/*.js'], {base: 'src'})
    .pipe(gulp.dest('lib'));

  glob("*/index.js", {
    cwd: "src/"
  }, function (err, files){
    files.forEach(function(file){
      return browserify(path.join(__dirname, "src", file))
        .bundle({debug: true})
        .pipe(source(file))
        .pipe(gulp.dest('lib'));
    });
  });
});

gulp.task('develop', ['make:lib'], function(){
  var port = process.env.PORT || 3000;
  var app = connect();
  var watcher = gulp.watch('**/*.*', {cwd: './src/'});

  watcher.on('change', function(file){
    var src   = path.join(__dirname, 'src');
    var ext   = path.extname(file.path);
    var fPath = file.path.replace(src, '').split(path.sep).slice(1);
    var proj  = fPath[0];
    var type  = file.type;

    fPath = fPath.join(path.sep);

    if(ext === ".js"){
      browserify(path.join(__dirname, 'src', proj))
        .bundle({debug: true})
        .pipe(source(path.join(proj, 'index.js')))
        .pipe(gulp.dest('lib'));
      return;
    }

    if(type === "changed" || type === "added"){
      gulp.src(file.path, {base: 'src'}).pipe(gulp.dest('lib'));
    }

    if(type === "deleted"){
      gulp.src(fPath, {cwd: 'lib'}).pipe(clean());
    }
  });

  console.log('server on port '+port);
  app.use(connect.static('lib'));
  http.createServer(app).listen(port);
});
