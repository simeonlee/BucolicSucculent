var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
// var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var mainBowerFiles = require('gulp-main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var shell = require('gulp-shell');
var watch = require('gulp-watch');

gulp.task('nodemon', function() {
  nodemon({
    script: 'server/server.js',
    ext: 'html js'
  })
  .on('restart', function() {
    console.log('nodemon restarted server!')
  });
});

gulp.task('lint', function() {
  gulp.src(['./client/**/*.js', '!./client/lib/**']) //, './server/**/*.js' add to lint serverside js
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
  return gulp.src('./dist/*')
    .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./client/**/*.css', '!./client/lib/**'])
    .pipe(watch(['./client/**/*.css', '!./client/lib/**']))
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
  gulp.src(['./client/**/*.js', '!./client/lib/**'])
    .pipe(watch(['./client/**/*.js', '!./client/lib/**']))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('bower-files', function(){
    return gulp.src('./bower.json')
        .pipe(watch('./bower.json'))
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/lib'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./client/**/*.html')
    .pipe(watch('./client/**/*.html'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('set-dev', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('forever', shell.task([
  'forever start server/server.js'
]));

gulp.task('stop', shell.task([
  'forever stop server/server.js'
]));
 
gulp.task('default', ['lint', 'nodemon']);

gulp.task('build', function() {
  runSequence(
    'clean',
    ['lint', 'minify-css', 'minify-js', 'copy-html-files', 'bower-files']
  );
})

gulp.task('devStart', function() {
  runSequence(
    'set-dev',
    'build',
    'default'
  );
});

gulp.task('prodStart', function() {
  runSequence(
    'set-prod',
    'build',
    'forever'
  );
});
