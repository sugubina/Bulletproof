var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browser = require('browser-sync');
var run = require('gulp-run');
var reload = browser.reload;
var fileInclude = require('gulp-file-include');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');

function getZipDate () {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return yyyy + mm + dd;

}

gulp.task('serve', ['sass'], function() {
    browser({
        port: process.env.PORT || 4500,
        open: false,
        ghostMode: false,
        server: {
            baseDir: './out/'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('src/sass/**', ['sass']);
    gulp.watch('src/img/**', ['copy']);
    gulp.watch('src/js/**', ['copy']);
    gulp.watch('src/html/**/*.html', ['fileinclude', reload]);
    gulp.watch('src/**/*.js', reload);
});

gulp.task('copy', function() {
    gulp.src('src/js/**')
      .pipe(gulp.dest('out/js'));
    gulp.src('src/img/**')
      .pipe(gulp.dest('out/img'));
    gulp.src('src/fonts/**')
      .pipe(gulp.dest('out/fonts'));
    gulp.src('node_modules/jquery/dist/jquery.js')
      .pipe(gulp.dest('out/js/vendor'));
});

gulp.task('sass', function () {
    gulp.src('./src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./out/css'))
        .pipe(reload({
            stream: true
        }));
});

// gulp.task('clean-out', function () {
//     return run('rm -rf out/').exec();
// });

gulp.task('autoprefixer', function () {
    return gulp.src('out/css/*.css')
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: true
        }))
        .pipe(gulp.dest('out/css/'));
});

gulp.task('fileinclude', function() {
    return gulp.src(['./src/html/index.html','./src/html/thx.html','./src/html/index_2.html','./src/html/index_3.html'])
        .pipe(fileInclude({
              prefix: '@@',
              basepath: './src/html/partials/'
        }))
        .pipe(gulp.dest('./out'));
});

gulp.task('clean-dist', function () {
    return run('rm -rf dist/').exec();
});

gulp.task('copy_dist', function () {
    gulp.src('./out/css/main.css')
        .pipe(gulp.dest('./dist/css/'));
    gulp.src('./out/fonts/**')
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('compress-img', function () {
    return gulp.src('./src/img/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('create-zip', function () {
    return gulp.src('./dist/**')
        .pipe(zip(getZipDate() + '_' + __dirname.match(/\d+/g)[0] + '_lp.zip'))
        .pipe(gulp.dest('.'));
});

function replaceContent(filePath) {
    return gulp.src(filePath)
        .pipe(useref())
        .pipe(replace(/<!--CAMINO_LP_TRACKER-->/g, 'CAMINO_LP_TRACKER'))
        .pipe(replace(/<!-- dont change -->71 77 36 013<!-- -->/, 'CAMINO_LINK_PARAMETER'))
        .pipe(replace(/<!--CAMINO_TYP_TRACKER-->/g, 'CAMINO_TYP_TRACKER'))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest('./dist'));
}

gulp.task('replace-lp', function () {
    return replaceContent('./out/index.html');
});

gulp.task('replace-thx', function () {
    return replaceContent('./out/thx.html');
});

gulp.task('default', function () {
    runSequence('fileinclude', 'sass', 'copy', 'watch', 'serve');
});
gulp.task('dist_lp', function () {
    runSequence('clean-dist', 'copy_dist', 'replace-lp', 'compress-img', 'create-zip', 'clean-dist');
});
gulp.task('dist_thx', function () {
    runSequence('clean-dist', 'copy_dist', 'replace-thx', 'compress-img', 'create-zip', 'clean-dist');
});
