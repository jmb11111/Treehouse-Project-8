"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    glob = require("glob"),
    minify = require("gulp-uglify");

gulp.task("concatScripts", ()=>{
    gulp.src(["js/circle/**.js"])
    .pipe(concat("global.js"))
    .pipe(gulp.dest('js'));
});

gulp.task("minifyScrips", ()=>{
    gulp.src("js/global.js")
    .pipe(minify())
    .pipe(gulp.dest('js'));
});