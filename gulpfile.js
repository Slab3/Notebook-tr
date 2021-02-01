let gulp = require('gulp');
let concat = require('gulp-concat');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');


gulp.task('js', function () {
    return gulp.src(["scripts/**/*.js"])
        .pipe(concat('main.js'))
        .pipe(gulp.dest("build"));
});

gulp.task('watch', function () {
    gulp.watch('scripts/**/*.js', gulp.series(['js']));
    gulp.watch('styles/**/*.scss', gulp.series(['scss']));
});

gulp.task('scss', function () {
    return gulp.src(["styles/main.scss"])
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(gulp.dest("build"));
});