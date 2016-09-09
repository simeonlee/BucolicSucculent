var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('develop', function() {
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
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
  gulp.src(['./client/**/*.js', '!./client/lib/**'])
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('bower-files', function(){
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/lib'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./client/**/*.html')
    .pipe(gulp.dest('dist/'));
});
 
gulp.task('default', ['lint', 'develop']);

gulp.task('build', function() {
  runSequence(
    'clean',
    ['lint', 'minify-css', 'minify-js', 'copy-html-files', 'bower-files']
  );
})
