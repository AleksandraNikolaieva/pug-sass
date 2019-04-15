const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imgmin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const devFolder = './dev';
const buildFolder = './dest';

browserSync.init({
  server: {
    baseDir: './dest'
  },
  notify: false
});

gulp.task('views', () => {
  return gulp.src(`${devFolder}/views/index.pug`)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(`${buildFolder}`))
});

gulp.task('styles', () => {
  return gulp.src(`${devFolder}/styles/main.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${buildFolder}/css`));
});

gulp.task('img', () => {
  return gulp.src(`${devFolder}/img/*`)
    .pipe(imgmin({
      interlaced: true,
      progressive: true,
      svgoPlagins: [{removeViewBox: false}],
      une: [pngquant()]
    }))
    .pipe(gulp.dest(`${buildFolder}/img`))
})

gulp.task('watch', () => {
  gulp.watch(`${devFolder}/styles/**/*.scss`, gulp.parallel('styles'));
  gulp.watch(`${devFolder}/views/**/*.pug`, gulp.parallel('views'));
  gulp.watch(`${devFolder}/img/*`, gulp.parallel('img'));
  gulp.watch([`${buildFolder}/index.html`, `${buildFolder}/css/main.css`, `${buildFolder}/img/*`]).on('change', browserSync.reload);
});

gulp.task('build', gulp.series('views', 'styles', 'img', 'watch'));