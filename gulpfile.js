"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
      sass = require("gulp-sass"),
       map = require("gulp-sourcemaps"),
 cssMinify = require('gulp-cssnano'),
       del = require("del"),
 webserver = require('gulp-webserver'),
     image = require('gulp-image'),
    minify = require("gulp-uglify");

gulp.task("clean",()=>{
         del(["dist", "styles", "scripts/**.js*"]);
        })
        
gulp.task("concatScripts", ()=>{
   return gulp.src(["global.js","jquery.js","scripts/global.js","scripts/circle/**.js"])
    .pipe(map.init())
    .pipe(concat("global.js"))
    .pipe(map.write("./"))
    .pipe(gulp.dest('scripts'));
});

gulp.task("scripts",["concatScripts"], ()=>{
   return gulp.src("scripts/global.js")
    .pipe(minify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});
gulp.task("watchSass",()=>{
    gulp.watch("sass/**/*.scss", ["compileSass"]);
})
gulp.task("compileSass", ()=>{
    return gulp.src("sass/global.scss")
    .pipe(map.init())
    .pipe(sass())
    .pipe(map.write("./"))
    .pipe(gulp.dest("styles"));
})

gulp.task("styles",["compileSass"], ()=>{
    return gulp.src("styles/global.css")
    
    .pipe(rename("all.css"))
    .pipe(gulp.dest("dist/styles"));
})



gulp.task('image', function () {
   return gulp.src('./images/*')
      .pipe(image())
      .pipe(gulp.dest('dist/content'));
  });



  gulp.task("build",["clean","scripts","image","styles"],()=>{
       gulp.src(["index.html", "icons/**" ],{base: './'})
             .pipe(gulp.dest('dist')); 
  })

gulp.task("startServer",()=>{
    gulp.src('dist')
    .pipe(webserver({
        port: 8000,
        open: true,
        fallback: "index.html"
    }));
})



gulp.task("default", ["build"], ()=>{
    gulp.start("startServer");
 
})