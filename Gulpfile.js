// Подключаем Gulp
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    less = require('gulp-less'),
    rimraf = require('rimraf'),
    imagemin = require('gulp-imagemin');
    
    var path = {
        build: { // Куда складывать готовые файлы после сборки
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/i/',
            fonts: 'build/css/fonts/'
        },
        src: { // Откуда брать исходники
            html: 'src/*.html',
            js: 'src/js/*.js',
            css: 'src/css/style.less',
            img: 'src/i/**/*.*',
            fonts: 'src/css/fonts/**/*.*'
        },
        watch: { // За изменениями каких файлов мы хотим наблюдать
            html: 'src/**/*.html',
            js: 'src/js/**/*.js',
            css: 'src/css/**/*.less',
            img: 'src/i/**/*.*',
            fonts: 'src/css/fonts/**/*.*'
        },
        clean: './build'
    };

    gulp.task('html:build', function (done) {
        gulp.src(path.src.html) // Выберем файлы по нужному пути
            .pipe(rigger()) // Прогоним через rigger
            .pipe(gulp.dest(path.build.html)); // Переместим их в папку build
        done();
    });

    gulp.task('css:build', function (done) {
        gulp.src(path.src.css) // Выберем наш style.less
            .pipe(less()) // Скомпилируем
            .pipe(prefixer()) // Добавим вендорные префиксы
            .pipe(cssnano({zindex: false})) // Сожмем
            .pipe(gulp.dest(path.build.css)); // Переместим в build
        done();
    });

    gulp.task('image:build', function (done) {
        gulp.src(path.src.img) // Выберем наши картинки
            .pipe(imagemin({ // Сожмем их
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img)); // Переместим в build
        done();
    });

    gulp.task('fonts:build', function(done) {
        gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts)) // Переместим шрифты в build
        done();
    });
    
    
    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });
    
    
    gulp.task('build', (
        'html:build',
        'js:build',
        'css:build',
        'fonts:build',
        'image:build'
    ));
    
    
    gulp.task('watch', function(done) {
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.css], function(event, cb) {
            gulp.start('css:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
        done();
    });