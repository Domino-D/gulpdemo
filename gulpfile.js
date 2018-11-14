const gulp = require('gulp')
const sass = require('gulp-sass')
const gulpIf = require('gulp-if')
const gulpCSS = require('gulp-minify-css')
const uglify = require('gulp-uglify')
const useref = require('gulp-useref')
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync')
const del = require('del')
const runSequence = require('run-sequence')

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('imagemin', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest('dist/images'))
})

gulp.task('clean:dist', function (cb) {
  del(
    [
      'dist/**/*',
      '!dist/images',
      '!dist/images/**/*'
    ],
    cb
  )
})

gulp.task('clean', function (cb) {
  del('dist')
  return cache.clearAll(cb)
})

gulp.task('useref', function () {
  return gulp.src('src/*.html')
    .pipe(
      gulpIf('*.css', gulpCSS())
    )
    .pipe(
      gulpIf('*.js', uglify())
    )
    .pipe(useref())
    .pipe(gulp.dest('dist'))
})

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('src/scss/**/*.scss', ['sass'])
  gulp.watch('src/*.html', browserSync.reload)
  gulp.watch('src/js/**/*.js', browserSync.reload)
})

gulp.task('bulid', function (cb) {
  runSequence(
    'clean:dist',
    [
      'sass',
      'useref',
      'images'
    ],
    cb
  )
})

gulp.task('default', function (cb) {
  runSequence(
    [
      'sass',
      'browserSync',
      'watch'
    ],
    cb
  )
})