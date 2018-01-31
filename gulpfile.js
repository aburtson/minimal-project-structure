'use strict';

const gulp 		   = require('gulp');				// gulp!
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
var mainScripts = [
	'./src/assets/js/main/main.js'
];

// prettify html and place in dist
gulp.task('getHtml', function() {
	return gulp.src('src/views/**/*.html')
	.pipe(plumber())
	.pipe(prettify())
	.pipe(gulp.dest('./dist')) // output rendered html into /dist
	.pipe(browserSync.stream());
});

// place js in dist
gulp.task('getScripts', function() {
	return gulp.src(vendorScripts)
	.pipe(plumber())
	.pipe(gulp.dest('./dist/assets/js/vendors')) // output rendered html into /dist
	.pipe(browserSync.stream());
});

// concatenate js into dist/assets/js/app.js
gulp.task('concatScripts', function() {
	return gulp.src(mainScripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))					// concatenate js into app.js
	.pipe(maps.write('./'))					// create source maps
	.pipe(gulp.dest('./dist/assets/js'));	// place files in /dist/assets/js
});

// concatenate and minify js into dist/assets/js/app.min.js
gulp.task('minifyScripts', function() {
	return gulp.src(mainScripts)
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(concat('app.js')) 				// concatenate js into app.js
	.pipe(uglify())							// minify app.js
	.pipe(rename("app.min.js"))				// rename to app.min.js
	.pipe(maps.write('./'))					// create source maps
	.pipe(gulp.dest('./dist/assets/js'))	// place files in /dist/assets/js
	.pipe(browserSync.stream());			// reload the browser
});

// compile sass into dist/assets/css/main.min.css
gulp.task('compileSass', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(maps.init())
	.pipe(sass())											// compile sass from scss/main.scss to main.css
	.pipe(autoprefixer({browsers:['last 2 versions']}))		// add css prefixes
	.pipe(maps.write('./'))									// write source maps
	.pipe(gulp.dest('dist/assets/css'));					// place maps and css in /dist/assets/css
});

// compile and minify sass into dist/assets/css/main.min.css
gulp.task('minifyCss', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(sass())													// compile sass from scss/main.scss to main.css
	.pipe(autoprefixer({browsers:['last 5 versions', 'IE 9']}))		// add css prefixes
	.pipe(cssnano())												// minify css
	.pipe(rename("main.min.css"))									// rename to main.min.css
	.pipe(maps.write('./'))											// write source maps
	.pipe(gulp.dest('./dist/assets/css'))							// place maps and min.css in /dist/assets/css
	.pipe(browserSync.stream());									// reload the browser
});


// start dev server and watch files
gulp.task('watchFiles',['build'], function() {
	browserSync.init({
        server: "./dist"
    });
	gulp.watch('./src/assets/scss/**/*.scss', ['minifyCss']);
	gulp.watch('./src/assets/js/**/*.js', ['minifyScripts']);
	gulp.watch('./src/views/**/*.html', ['getHtml']);
});

// build dist directory and add all files for production
gulp.task('build', ['getHtml', 'getScripts', 'minifyScripts', 'minifyCss','compileSass','concatScripts'], function() {
	return gulp.src(["src/assets/img/**"], { base: './src'})
	.pipe(gulp.dest('dist'));
});

// deletes all folders created by gulp tasks
gulp.task('clean', function(){
	del(['dist']);
});

// default task: run watch listeners
gulp.task('default', [], function() {
	gulp.start(['watchFiles']);
});
