"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
      sass = require("gulp-sass"),
       map = require("gulp-sourcemaps"),
 cssMinify = require("gulp-clean-css"),
       del = require("del"),
 webserver = require('gulp-webserver'),
    minify = require("gulp-uglify");

gulp.task("concatScripts", ()=>{
   return gulp.src(["jquery.js,scripts/**.js","scripts/circle/**.js"])
    .pipe(map.init())
    .pipe(concat("global.js"))
    .pipe(map.write("./"))
    .pipe(gulp.dest('scripts'));
});

gulp.task("minifyScrips",["concatScripts"], ()=>{
   return gulp.src("scripts/global.js")
    .pipe(minify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('scripts'));
});

gulp.task("compileSass", ()=>{
    return gulp.src("sass/global.scss")
    .pipe(map.init())
    .pipe(sass())
    .pipe(map.write("./"))
    .pipe(gulp.dest("styles"));
})
gulp.task("minifySass",["compileSass"], ()=>{
    return gulp.src("styles/global.css")
    .pipe(cssMinify())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("styles"));

})

gulp.task("scripts",["minifyScrips"])

gulp.task("styles",["minifySass"])

gulp.task("clean",()=>{
del(["dist", "styles", "scripts/**.js*"]);
})

gulp.task("distribution",["clean","scripts","styles"], ()=>{
    return gulp.src(["scripts/all.min.js", "styles/all.min.css",
    "index.html","images/**", "icons/**" ],{base: './'})
    .pipe(gulp.dest('dist'));

})

gulp.task("build",["distribution"])

gulp.task("startServer",['build'],()=>{
    gulp.src('dist')
    .pipe(webserver({
        port: 3000,
        livereload: true,
        open: true,
    }));


})

gulp.task("default",["build"], ()=>{
   

})