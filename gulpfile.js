const {dest, parallel, series, src} = require('gulp');
const babel   = require('gulp-babel');
const del     = require('del');
const rename  = require('gulp-rename');
const replace = require('gulp-replace');
const rollup  = require('gulp-better-rollup');
const uglify  = require('gulp-uglify-es').default;

const babelOpts = {
	'presets': [[
		'@babel/env',
		{'modules': false, 'targets': {'ie': '11'}},
	]],
};

const uglifyOpts = {
	compress: true,
	mangle: true,
	keep_fnames: true,
};

function sources(dir, suffix) {return [
	'',
	'Classic',
	'Material',
	'Demo',
].map(el => `${dir}/aria-tabs${el}.${suffix}`);}

function cleanUp() {return del(['dist', 'build']);}

function bundle() {
	return src(sources('src', 'mjs'))
		.pipe(rollup({}, {format: 'iife'}))
		.pipe(rename(function(path) {path.extname = '.js';}))
		.pipe(dest('build'));
}

function bundleWithoutSQ() {
	return src(sources('src', 'mjs'))
		.pipe(rollup(
			{external:['../node_modules/shadow-query/shadowQuery.mjs']},
			{format: 'esm'}
		))
		.pipe(uglify(uglifyOpts))
		.pipe(replace(
			'import $ from"../node_modules/shadow-query/shadowQuery.mjs";',
			'import $ from"../shadow-query/shadowQuery.mjs";'
		))
		.pipe(rename(function(path) {path.extname = '.min.mjs';}))
		.pipe(dest('dist'));
}

function minify() {
	return src(sources('build', 'js'))
		.pipe(uglify(uglifyOpts))
		.pipe(rename(function(path) {path.extname = '.min.js';}))
		.pipe(dest('dist'));
}

function transpile() {
	return src(sources('build', 'js'))
		.pipe(babel(babelOpts))
		// .pipe(uglify(uglifyOpts))
		.pipe(rename(function(path) {path.extname = '.IE.min.js';}))
		.pipe(dest('dist'));
}

exports.default = series(
	cleanUp,
	parallel(
		bundleWithoutSQ,
		series(
			bundle,
			parallel(
				minify,
				transpile
			)
		)
	)
);
