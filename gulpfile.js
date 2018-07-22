"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    map = require("gulp-sourcemaps"),
    cssMinify = require("gulp-clean-css"),
    del = require("del"),
    webserver = require('gulp-webserver'),
    htmlReplace = require("gulp-html-replace"),
    image = require('gulp-image'),
    gulpCopy = require('gulp-copy'),
    runSequence = require('run-sequence'),
    minify = require("gulp-uglify");

gulp.task("concatScripts", () => {
    return gulp.src(["jquery.js", "scripts/circle/**.js"])
        .pipe(map.init())
        .pipe(concat("global.js"))
        .pipe(map.write("./"))
        .pipe(gulp.dest('scripts'));
});

gulp.task("compileSass", () => {
    return gulp.src("sass/global.scss")
        .pipe(map.init())
        .pipe(sass())
        .pipe(map.write("./"))
        .pipe(gulp.dest("styles"));
})
gulp.task("watchSass",()=>{
   return gulp.watch("sass/**/**/**/*.scss",['styles'])


})
gulp.task("scripts", ["concatScripts"], () => {
    return gulp.src("scripts/global.js")
        .pipe(minify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('scripts'))
        .pipe(gulpCopy("dist"));
});


gulp.task("styles", ["compileSass"], () => {
    return gulp.src("styles/global.css")
        .pipe(cssMinify())
        .pipe(rename("all.min.css"))
        .pipe(gulp.dest("styles"))
        .pipe(gulpCopy("dist"));;

})
gulp.task('newHTML', ["scripts", "styles"], function () {
    gulp.src('index.html')
        .pipe(htmlReplace({
            'css': 'styles/all.min.css',
            'js': 'scripts/all.min.js'
        }))
        .pipe(gulp.dest('dist/'));
});
gulp.task('image', function () {
    gulp.src('images/**')
      .pipe(image())
      .pipe(gulp.dest('dist/images'));
  });


gulp.task("clean", () => {
   return del(["dist","dist/**","scripts/**.js*","styles"]);
})

gulp.task("startServer",  () => {
   return gulp.src('dist')
        .pipe(webserver({
            port: 3000,
            livereload: true,
            open: true,
        }));


})
gulp.task("fileMove",()=>{
    let file =
    gulp.src([
        "icons/**"],
        { base: './' })
        .pipe(gulp.dest('dist'));
    return file;
})



gulp.task('build', function(callback) {
    runSequence('clean','image','fileMove',
                ['scripts', 'styles'],
                'newHTML',
                callback);
  });


gulp.task("default", ["build","watchSass"], () => {
    gulp.src('dist')
        .pipe(webserver({
            port: 3000,
            livereload: true,
            open: true,
        }));


})