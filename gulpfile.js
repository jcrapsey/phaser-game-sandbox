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
