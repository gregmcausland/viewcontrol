var gulp            = require('gulp');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var pixrem          = require('gulp-pixrem');
var cssmin          = require('gulp-cssmin');
var browserify      = require('gulp-browserify');
var uglify          = require('gulp-uglify');

gulp.task('css', function() {

    gulp.src('./scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(pixrem())
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./css'));

});

gulp.task('js', function() {

    gulp.src('./js/app.js')
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: false,
            debug: false
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));

    gulp.src('./jasmine/spec/spec.js')
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        .pipe(gulp.dest('./jasmine/build'));

});

gulp.task('default', function() {

    gulp.watch('./scss/**/*.scss', ['css']);
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./jasmine/spec/*.js', ['js']);

});
