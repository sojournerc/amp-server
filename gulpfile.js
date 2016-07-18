
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');

gulp.task('develop', function () { runSequence('build', 'watch') });

gulp.task('watch', function () {
  nodemon({
    script: 'build/app.js',
    tasks: ['build'],
    ext: 'js html hbs',
    ignore: ['build/', 'node_modules/']
  })
});

gulp.task('build', shell.task([
  'npm run build',
]))

gulp.task('default', ['develop']);
