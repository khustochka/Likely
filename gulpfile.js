// "autoprefixer-core": "^4.0.0",
// "gulp-postcss": "^3.0.0",
// "gulp-sass": "^1.1.0",
// "postcss-assets": "^0.9.0"

'use strict';

var gulp = require('gulp');
var fs = require('fs');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var zip = require('gulp-zip');

var packageJson = require('./package.json');

var release = './release/';

function comment(version) {
    /* eslint-disable no-sync */
    return fs.readFileSync('./source/header.js')
                         .toString()
                         .replace(/\$version/g, version);
    /* eslint-enable no-sync */
}

gulp.task('js', function () {
    var version = packageJson.version;

    return gulp.src('./source/likely.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(insert.prepend(comment(version)))
    .pipe(gulp.dest(release));
});

gulp.task('css', function () {
    return gulp.src('./styles/likely.styl')
    .pipe(stylus())
    .pipe(csso())
    .pipe(gulp.dest(release));
});

gulp.task('zip', ['js', 'css'], function () {
    var version = packageJson.version;

    return gulp.src([
        release + 'license.txt',
        release + 'likely.css',
        release + 'likely.js',
    ])
    .pipe(zip('ilya-birman-likely-' + version + '.zip'))
    .pipe(gulp.dest(release));
});

gulp.task('build', ['js', 'css']);

gulp.task('default', ['js', 'css', 'zip'], function () {
    gulp.watch('source/*.js', ['zip']);
    gulp.watch('source/services/*.js', ['zip']);
    gulp.watch('styles/*.styl', ['zip']);
    gulp.watch('license.txt', ['zip']);
});
