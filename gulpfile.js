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
//takes all required js files and concats them and maps them
gulp.task("concatScripts", () => {
    return gulp.src(["jquery.js", "scripts/circle/**.js"])
        .pipe(map.init())
        .pipe(concat("global.js"))
        .pipe(map.write("./"))
        .pipe(gulp.dest('scripts'));
});
// compiles all sass files into a css file, and adds maps
gulp.task("compileSass", () => {
    return gulp.src("sass/global.scss")
        .pipe(map.init())
        .pipe(sass())
        .pipe(map.write("./"))
        .pipe(gulp.dest("styles"));
})
// continuously watches sass files for changes
gulp.task("watchSass",()=>{
   return gulp.watch("sass/**/*.scss",['styles'])
})

// runs concatScripts, minifies it, makes a copy and puts it in the DIST folder
gulp.task("scripts", ["concatScripts"], () => {
    return gulp.src("scripts/global.js")
        .pipe(minify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('scripts'))
        .pipe(gulpCopy("dist"));
});

// runs compileSass, minifies it, makes a copy and puts it in the DIST folder

gulp.task("styles", ["compileSass"], () => {
    return gulp.src("styles/global.css")
        .pipe(cssMinify())
        .pipe(rename("all.min.css"))
        .pipe(gulp.dest("styles"))
        .pipe(gulpCopy("dist"));;
})

// creates a new HTML file for distribution, using the minified files as sources
gulp.task('newHTML', function () {
    gulp.src('index.html')
        .pipe(htmlReplace({
            'css': 'styles/all.min.css',
            'js': 'scripts/all.min.js'
        }))
        .pipe(gulp.dest('dist/'));
});

// optimizes image size and puts the new optimized images in distribution
gulp.task('image', function () {
    gulp.src('images/**')
      .pipe(image())
      .pipe(gulp.dest('dist/images'));
  });

// erases any files made from other tasks for a clean start
gulp.task("clean", () => {
   return del(["dist","dist/**","scripts/**.js*","styles"]);
})

// moves the rest of the needed files to distribution
gulp.task("fileMove",()=>{
    let file =
    gulp.src([
        "icons/**"],
        { base: './' })
        .pipe(gulp.dest('dist'));
    return file;
})


//runs clean for a fresh start, image, then fileMove, then scripts and styles simultaneously, then newHTMl
//uses runSequence to ensure clean is run first and that build process is not completed untill all other tasks are
gulp.task('build', function(callback) {
    runSequence('clean','image','fileMove',
                ['scripts', 'styles'],
                'newHTML',
                callback);
  });

//runs build and watch sass for live sass updates, then creates a server which has livereload enabled,
// to allow for live updates to sass code to be previewed 
gulp.task("default", ["build","watchSass"], () => {
    gulp.src('dist')
        .pipe(webserver({
            port: 3000,
            livereload: true,
            open: true,
        }));


})