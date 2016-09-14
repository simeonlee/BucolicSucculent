const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const ngAnnotate = require('gulp-ng-annotate');
const shell = require('gulp-shell');
const image = require('gulp-image');
const plumber = require('gulp-plumber'); // Handle gulp.watch errors without throwing / cancelling nodemon
 
gulp.task('default', []);

const config = {
  src: {
    html: ['./client/**/*.html', './client/*.ico'],
    css: './client/styles/scss/*.scss',
    js: ['./client/app/services.js', './client/controllers/dashboard.js', './client/controllers/game.js', './client/controllers/createGame.js', './client/controllers/auth.js', './client/app/app.js'],
    json: './client/styles/**/*.json',
    lib: ['./client/lib/lodash/lodash.js', './client/lib/angular/angular.js', './client/lib/ui-router/release/angular-ui-router.js', './client/lib/angular-simple-logger/dist/angular-simple-logger.js', './client/lib/angular-google-maps/dist/angular-google-maps.js', './client/lib/ngGeolocation/ngGeolocation.js'],
    img: ['./client/images/**', './client/images/**/*', '!./client/images/**/*.sketch']
  },
  build: {
    html: './dist/',
    css: './dist/styles/css/',
    js: './dist/',
    json: './dist/styles/',
    lib: './dist/lib/',
    img: './dist/images/'
  }
};

gulp.task('nodemon', function() {
  nodemon({
    script: 'server/server.js',
    ext: 'html js'
  })
  .on('start', ['watch'])
  .on('change', ['watch'])
  .on('restart', function() {
    console.log('nodemon restarted server!');
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

gulp.task('build-css', function() {
  var opts = { comments: true, spare: true };
  gulp.src(config.src.css)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(gulp.dest(config.build.css))
    .pipe(minifyCSS(opts))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(config.build.css));
})

gulp.task('minify-js', function() {
  return gulp.src(config.src.js)
    .pipe(plumber())
    .pipe(ngAnnotate())
    .pipe(concat('build.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.build.js));
});

gulp.task('bower-files', function(){
  return gulp.src(config.src.lib)
    .pipe(plumber())
    .pipe(concat('lib.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(config.build.lib));
});

gulp.task('copy-html-files', function () {
  gulp.src(config.src.html)
    .pipe(plumber())
    .pipe(gulp.dest(config.build.html));
});

gulp.task('copy-json-files', function () {
  gulp.src(config.src.json)
    .pipe(plumber())
    .pipe(gulp.dest(config.build.json));
});

gulp.task('image', function () {
  gulp.src(config.src.img)
    .pipe(image())
    .pipe(gulp.dest(config.build.img));
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


gulp.task('build', function() {
  runSequence(
    'clean',
<<<<<<< 2db9b6e5b0eac1ea858bbc631b5fc8b1e5caad14
    ['build-css', 'minify-js', 'copy-html-files', 'copy-json-files', 'bower-files', 'image']
  );
});

gulp.task('watch', function() {
  gulp.watch(config.src.css, ['build-css']);
  gulp.watch(config.src.js, ['minify-js']);
  gulp.watch(config.src.html, ['copy-html-files']);
  gulp.watch(config.src.json, ['copy-json-files']);
  gulp.watch(config.src.lib, ['bower-files']);
  gulp.watch(config.src.img, ['image']);
});

gulp.task('default', function() {
  runSequence(
    'set-dev',
    'build',
    'watch',
    'nodemon'
  );
});

// Would like to eventually deprecate 'devStart' in favor of 'default'
gulp.task('devStart', function() {
  runSequence(
    'set-dev',
    'build',
    'watch',
    'nodemon'
  );
});

gulp.task('prodStart', function() {
  runSequence(
    'set-prod',
    'build',
    'forever'
  );
});