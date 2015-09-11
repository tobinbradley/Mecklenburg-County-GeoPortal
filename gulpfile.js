var postcss = require("gulp-postcss"),
    gulp = require("gulp"),
    cssnext = require("cssnext"),
    sourcemaps = require("gulp-sourcemaps"),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    replace = require('gulp-replace'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    nano = require('gulp-cssnano');


// main controller tasks
// add "--type production" to compress CSs and uglify JS
gulp.task('default', ['watch', 'browser-sync']);
gulp.task('build', ['css', 'js', 'replace', 'imagemin', 'fonts']);

// Live reload server
gulp.task('browser-sync', function() {
    browserSync(['./public/**/*'], {
        server: {
            baseDir: "./public"
        }
    });
});

// watch tasks
gulp.task('watch', function () {
    gulp.watch(['./app/*.html'], ['replace']);
    gulp.watch(['./app/css/**/*.css'], ['css']);
    gulp.watch(['./app/js/**/*.js', './app/js/**/*.jsx'], ['js']);
    gulp.watch('./app/img/**/*', ['imagemin']);
});

// process HTML with cache busting
gulp.task('replace', function() {
    return gulp.src('app/*.html')
        .pipe(replace("{{cachebuster}}", Math.floor((Math.random() * 100000) + 1)))
        .pipe(gulp.dest('public/'));
});

// move fonts
gulp.task('fonts', function() {
    return gulp.src('app/fonts/*.*')
        .pipe(gulp.dest('public/fonts/'));
});

// JavaScript
gulp.task('js', function () {
  var b = browserify({
    entries: ['./app/js/app.js'],
    debug: true,
    transform: [reactify, babelify.configure({'only': './app/js/'})]
  });
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
});

// CSS
gulp.task("css", function() {
    var processors = [
        cssnext({
            'browers': ['last 3 version'],
            'customProperties': true,
            'colorFunction': true,
            'customSelectors': true
        })
    ];
    return gulp.src('./app/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(gutil.env.type === 'production' ? nano() : gutil.noop())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'));
});

// image minification
gulp.task('imagemin', function() {
    return gulp.src('app/img/*')
        .pipe(imagemin({
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('public/img'));
});
