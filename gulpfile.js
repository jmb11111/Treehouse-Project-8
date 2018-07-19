"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    map = require("gulp-sourcemap"),
    minify = require("gulp-uglify");

gulp.task("concatScripts", ()=>{
   return gulp.src(["js/circle/**.js"])
    .pipe(concat("global.js"))
    .pipe(gulp.dest('js'));
});

gulp.task("minifyScrips",["concatScripts"], ()=>{
   return gulp.src("js/global.js")
    .pipe(minify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task("compileSass", ()=>{
    return gulp.src("sass/global.scss")
    .pipe(sass())
    .pipe(gulp.dest("css"));
})
gulp.task("minifySass",["compileSass"], ()=>{
    return gulp.src("css/global.css")
    .pipe(minify())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("css"));

})

gulp.task("scripts",["minifyScrips"])