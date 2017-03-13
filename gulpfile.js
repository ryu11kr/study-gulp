//셋팅
var gulp = require('gulp'),	//걸프구동
	csslint = require('gulp-csslint'),
	//csslintreport = require('gulp-csslint-report'),
	concatcss = require('gulp-concat-css'),
	uglifycss = require('gulp-uglifycss'),
	jshint = require('gulp-jshint'),	//js 문법 오류 검사
	uglify = require('gulp-uglify'),	//파일내에 내용 압축 구동
	concat = require('gulp-concat'),	//파일결합 플러그인 구동
	rename = require('gulp-rename'),	//파일명을 새롭게 정의하는 플러그인 구동
	gulpif = require('gulp-if'),
	del = require('del'),
	config = require('./config.json');
/*
gulp.task('default' , function(){
	console.log('gulp default 일이 수행되었습니다.');
});
*/
/*
gulp.task('zip.js' , function(){	//실행할 명령어 입력 , gulp zip.js
	gulp
		//.src(['./src/domheler-id.js', './src/domheler-tag.js'])
		.src('./src/*.js')	//src 디렉토리의 모든 js 호출
		.pipe(jshint()) //파일 병합전 js 문법 오류 검사
		.pipe(jshint.reporter('jshint-stylish')) //오류 출력하기
		.pipe(concat('compression.js'))	//파일 결합할 파일명 생성 및 파일내용삽입
		.pipe(gulp.dest('./compression'))	//생성된 파일이 저장될 위치
		.pipe(uglify({ //파일 내에 내용을 압축한다
			//mangle:false, //인자값을 한글자로 할지 정함.
			//preserveComments:'some' // all : 주석을 포함할지, some : ! 중요주석만 포함할지 정함 
		})) 
		.pipe(rename('compression.min.js')) // 압축된 코드가 들어있는 파일의 이름 생성
		.pipe(gulp.dest('./compression'));	// 압축된 코드가 들어있는 파일의 위치 생성
});
/**/
/**/




//기본 실행
gulp.task('nstart.js' , ['clean.js' , 'style.css' , 'exe.js']);

// 지속적 관찰
gulp.task('watch' , ['clean.js'], function(){
	gulp.watch(config.path.css.src, ['style.css']);
	gulp.watch(config.path.js.src, ['exe.js']);
})


//배포 디렉토리 청소
gulp.task('clean.js' , function(){
	gulp
		del(config.path.js.dest+'/*');
		del(config.path.css.dest+'/*');
});

//css
gulp.task('style.css' , function(){
	gulp
		.src(config.path.css.src)
		.pipe(gulpif(config.lint, csslint({'import' : false})))
		.pipe(gulpif(config.lint, csslint.formatter()))
		.pipe(gulpif(config.concat, concatcss(config.path.css.filename)))
		.pipe(gulpif(config.rename, gulp.dest(config.path.css.dest)))
		.pipe(gulpif(config.uglify, uglifycss()))
		.pipe(gulpif(config.rename, rename({suffix:'.min'})))
		.pipe(gulp.dest(config.path.css.dest));
});

//실행
gulp.task('exe.js' , ['hint.js' , 'concat.js' , 'uglify.js']);

// js 문법 검사 및 출력
gulp.task('hint.js' , function(){
	gulp
		.src(config.path.js.src)
		.pipe(jshint()) 
		.pipe(jshint.reporter('jshint-stylish'));
});

// 여러 파일결합해서 하나의 파일로 생성
gulp.task('concat.js' , function(){
	gulp
		.src(config.path.js.src)	
		.pipe(concat(config.path.js.filename))
		.pipe(gulp.dest(config.path.js.dest));
});

// 생성된 하나의 파일을 코드압축해서 새 파일로 생성
gulp.task('uglify.js' , function(){
	gulp
		.src(config.path.js.dest + config.path.js.filename)
		.pipe(uglify()) 
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest(config.path.js.dest));
});
/**/
