var gulp  = require('gulp'),
  concat = require('gulp-concat'),
  changed = require('gulp-changed'),
  gulpif = require('gulp-if'),
  minifycss = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
  multInject = require('gulp-multinject'),
  sass   = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  del = require('del'),
  imageResize = require('gulp-image-resize'),
  imagemin = require('gulp-imagemin'),
  argv = require('yargs').argv;

var production = !!(argv.production); // true if --production flag is used

var devCSSLibs = [
  '//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.css',
  '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css'
]
var prodCSSLibs = [
  '//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
  '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
]

// clean out directories that will be built
gulp.task('clean', function(cb) {
  del(['public'], cb)
});

// all project scss
// TODO add an autoprefixer
gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulpif(production, minifycss()))
    .pipe(gulp.dest('public/assets/css'));
});

// just copypasta raw media
gulp.task('copy-media', function() {
  return gulp.src('source/media/**/*')
    .pipe(changed('public/assets/media'))
    .pipe(gulp.dest('public/assets/media'));
});

// resize jpgs and pngs
gulp.task('resize-images', function() {
  return gulp.src('source/media/**/*.{jpg,png}')
  .pipe(plumber())
  .pipe(imagemin({optimizationLevel: 5, progressive: true}))

  .pipe(imageResize({
     width: '100%'
  }))
  .pipe(gulp.dest('public/assets/media/full'))

  .pipe(imageResize({
     width: 2000,
     height: 2000,
     crop: true
  }))
  .pipe(gulp.dest('public/assets/media/2000'))

  .pipe(imageResize({
     width: 1200,
     height: 1200,
     crop: true
  }))
  .pipe(gulp.dest('public/assets/media/1200'))

  .pipe(imageResize({
     width: 800,
     height: 800,
     crop: true
  }))
  .pipe(gulp.dest('public/assets/media/800'))

});



// index
gulp.task('build-index', function() {
  return gulp.src('source/index.html')
    .pipe(plumber())
    .pipe(gulpif(production, multInject(prodCSSLibs, 'cssLibNamespace'), multInject(devCSSLibs, 'cssLibNamespace')))
    .pipe(gulpif(production, minifyHTML()))
    .pipe(gulp.dest('public'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/index.html', ['build-index']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
  gulp.watch('source/media/**/*.*', ['copy-media']);
  gulp.watch('source/media/**/*.*', ['resize-images']);
});

// default just builds everything for a dev environment
gulp.task('default', ['clean'], function() {
  gulp.start('build-index', 'build-css', 'copy-media', 'resize-images');
});

