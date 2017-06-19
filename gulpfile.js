'use strict';

const gulp 		   = require('gulp');
const concat 	   = require('gulp-concat'); 		// concatenates js
const uglify       = require('gulp-uglify'); 		// minifies js
const rename       = require('gulp-rename'); 		// renames files
const sass         = require('gulp-sass');			// compiles sass
const maps         = require('gulp-sourcemaps'); 	// makes sourcemaps for js, css, scss,less
const cssnano      = require('gulp-cssnano'); 		// minifies css
const del          = require('del'); 				// deletes files for clean up
const autoprefixer = require('gulp-autoprefixer');  // auto-adds vendor prefixes to css
const browserSync  = require('browser-sync'); 		// reloads browser after changing a file
const prettify     = require('gulp-prettify'); 		// indents html files properly
const plumber      = require('gulp-plumber'); 		// handles gulp errors

var vendorScripts = [ 'node_modules/jquery/dist/jquery.min.js' ];
var mainScripts = [ './src/assets/js/main/main.js' ];

// prettifies html and places it in dist
gulp.task('get_html', function() {
	return gulp.src('src/views/**/*.html')
	.pipe(plumber())
	.pipe(prettify())
	.pipe(gulp.dest('./dist')) // output the rendered HTML files to the "dist" directory
	.pipe(browserSync.stream());
});

// prettifies js and places it in dist
gulp.task('get_scripts', function() {
	return gulp.src(vendorScripts)
	.pipe(plumber())
	.pipe(gulp.dest('./dist/assets/js/vendors')) // output the rendered HTML files to the "dist" directory
	.pipe(browserSync.stream());
});

// concatinates js from the scripts var into one file app.js,
// and places the file in dist/js
gulp.task('concatScripts', function() {
	return gulp.src(mainScripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/js'));
});


// concatinates js from the scripts var into one file app.js,
// minifys app.js into app.min.js,
// then writes the source maps,
// places both files in ./js,
// and reloads the browser
gulp.task('minifyScripts', function() {
	return gulp.src(mainScripts)
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(rename("app.min.js"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/js'))
	.pipe(browserSync.stream());
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// writes source maps
// places both in dist/css
gulp.task('compileSass', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(autoprefixer({browsers:['last 2 versions']}))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/assets/css'));
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// minifies css to main.min.css
// writes source maps
// places both in dist/css
gulp.task('minifyCss', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(sass())
	.pipe(autoprefixer({browsers:['last 5 versions', 'IE 9']}))
	.pipe(cssnano())
	.pipe(rename("main.min.css"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/css'))
	.pipe(browserSync.stream());
});


// starts development server at localhost:3000
// watches html, js, and scss and runs associated tasks
gulp.task('watchFiles',['build'], function() {
	browserSync.init({
        server: "./dist"
    });
	gulp.watch('./src/assets/scss/**/*.scss', ['minifyCss']);
	gulp.watch('./src/assets/js/**/*.js', ['minifyScripts']);
	gulp.watch('./src/views/**/*.html', ['get_html']);
});

// builds the dist directory and by running associated tasks
// that place their contents in dist, and by placing the folders and
// files returned from gulp.src into dist
gulp.task('build', ['get_html', 'get_scripts', 'minifyScripts', 'minifyCss','compileSass','concatScripts'], function() {
	return gulp.src(["src/assets/img/**"], { base: './src'})
	.pipe(gulp.dest('dist'));
});

// deletes all folders created by gulp tasks
gulp.task('clean', function(){
	del(['dist']);
});

// default task is set to start the watch listeners
gulp.task('default', [], function() {
	gulp.start(['watchFiles']);
});
