const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const smartGrid = require('smart-grid');
const path = require('path');

let isMap = process.argv.includes('--map');
let isMinify = process.argv.includes('--clean');
let isSync = process.argv.includes('--sync');

function clean(){
	return del('./build/*');
}

function html(){
	return gulp.src('./src/**/*.html')
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function styles(){
	return gulp.src('./src/less/main.less')
			   .pipe(gulpIf(isMap, sourcemaps.init()))
			   .pipe(less())
			   .pipe(autoprefixer())
			   .pipe(gcmq())
			   .pipe(gulpIf(isMinify, cleanCSS({
			   		level: 2
			   })))
			   .pipe(gulpIf(isMap, sourcemaps.write()))
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function images(){
	return gulp.src('./src/img/**/*')
			   .pipe(gulp.dest('./build/img'));
}

function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/"
	        }
	    });
		gulp.watch('./src/less/**/*.less', styles);
		gulp.watch('./src/**/*.html', html);
		gulp.watch('./smartgrid.js', grid);
	}
}

function grid(done){
	delete require.cache[path.resolve('./smartgrid.js')];
	let options = require('./smartgrid.js');
	smartGrid('./src/less', options);
	done();
}

let build = gulp.series(clean, gulp.parallel(html, styles, images));
let dev = gulp.series(build, watch);

gulp.task('build', build);
gulp.task('watch', dev);
gulp.task('grid', grid);