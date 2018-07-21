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
        minify = require("gulp-uglify");

gulp.task("concatScripts", ()=>{
   return gulp.src(["jquery.js","scripts/circle/**.js"])
    .pipe(map.init())
    .pipe(concat("global.js"))
    .pipe(map.write("./"))
    .pipe(gulp.dest('scripts'));
});

gulp.task("scripts",["concatScripts"], ()=>{
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
gulp.task("styles",["compileSass"], ()=>{
    return gulp.src("styles/global.css")
    .pipe(cssMinify())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("styles"));

})



gulp.task("clean",()=>{
del(["dist", "styles", "scripts/**.js*"]);
})
gulp.task('newHTML',["scripts","styles"], function() {
    gulp.src('index.html')
      .pipe(htmlReplace({
          'css': 'styles/all.min.css',
          'js': 'scripts/all.min.js'
      }))
      .pipe(gulp.dest('dist/'));
  });

gulp.task("distribution",["clean","scripts","styles","newHTML"], ()=>{
    return gulp.src([
    "scripts/**.min.js", 
    "styles/**.min.css",
    "images/**",
    "icons/**" ],
        {base: './'})
    .pipe(gulp.dest('dist'));

})

gulp.task("build",["clean"],()=>{
    const files= 
        (gulp.start("newHTML"),
        gulp.src([
        "scripts/all.min.js", 
        "styles/all.min.css",
        "images/**",
        "icons/**" ],
            {base: './'})
        .pipe(gulp.dest('dist')));

    return files;



})

gulp.task("startServer",['build'],()=>{
    gulp.src('dist')
    .pipe(webserver({
        port: 3000,
        livereload: true,
        open: true,
    }));


})

gulp.task("default",["build"], ()=>{
    gulp.src('dist')
    .pipe(webserver({
        port: 3000,
        livereload: true,
        open: true,
    }));


})