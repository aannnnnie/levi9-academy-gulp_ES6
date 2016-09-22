const gulp = require('gulp');
const del = require('del'); 
const sourcemaps = require('gulp-sourcemaps');
const bower = require('gulp-bower');
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const path = require('path');
const browserSync = require('browser-sync');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const babel = require('gulp-babel');

var src = {
    js: {
        custom: [
            './app/js/vanilla.js'
        ]
    },
    css: {
        libs: ['./public/bower_components/bootstrap-css/css/bootstrap.min.css'],
        custom: [
        	'./app/css/style.css'
        ]
    },
    html: {
        main: './app/index.html'
    }
},
    dest = './public';

gulp.task('jshint', function(){
	return gulp.src(src.js.custom)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
})

gulp.task('styles', function() {
	return gulp.src(src.css.custom)
	.pipe(gulp.dest(dest))
	.pipe(browserSync.reload({
		stream: true
	}));
});


gulp.task('assets', function(){
	return gulp.src(src.js.custom)
	.pipe(sourcemaps.init())
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest(dest))
	.pipe(browserSync.reload({
		stream: true
	}));
});

gulp.task('view', function(){
	return gulp.src(src.html.main)
	.pipe(gulp.dest(dest));
});

gulp.task('clean', function(){
	return del(dest);
});

gulp.task('bower-install', function() {
	return bower('./public/bower_components')
	.pipe(gulp.dest('./public/bower_components'))
});

gulp.task('build', gulp.series(
	'clean',  
	gulp.parallel('view', 'bower-install', 'styles', 'assets'), function() {
	var sourceFiles = gulp.src(src.css.libs
                                     .concat([path.join(dest, 'all.js')])
                                     .concat([path.join(dest, '*.css')]), { read: false }, {relative: true});

    return gulp.src(src.html.main)
               .pipe(inject(sourceFiles, {ignorePath: 'public'}))
               .pipe(gulp.dest(dest))
}));


gulp.task('watch', function() {
	gulp.watch('app/css/**/*.*', gulp.series('styles'));
	gulp.watch('app/js/**/*.*', gulp.series('assets'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('jshint', 'build', gulp.parallel('watch', 'serve')));