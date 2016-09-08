var gulp = require('gulp'),
  connect = require('gulp-connect'),
  nodemon = require('gulp-nodemon');
 
gulp.task('connect', function() {
  connect.server();
});

gulp.task('develop', function() {
  nodemon({
    script: 'server/server.js',
    ext: 'html js'
  })
  .on('restart', function() {
    console.log('nodemon restarted server!')
  });
});
 
gulp.task('default', ['connect']);
