/*jshint node:true */

"use strict";

var map = require('map-stream'),
	rimraf = require('rimraf'),
	fs = require('fs'),
	gutil = require('gulp-util'),
	path = require('path');

module.exports = function(options){
	if (!options) {
		options = {};
	}

	return map(function (file, cb){
		var cwd = file.cwd || process.cwd();
		// For safety always resolve paths
		var filepath = path.resolve(cwd, file.path);
		var starts = new RegExp('^' + cwd + '/');

		if (filepath === cwd) {
			gutil.log('gulp-rimraf: Cannot delete the current working directory. (' + filepath + ')');
			return cb(null, file);
		}

		if (!options.force && !starts.test(filepath)) {
			gutil.log('gulp-rimraf: Cannot delete files or folders outside the current working directory. (' + filepath + ')');
			return cb(null, file);
		}

		rimraf(filepath, function (err) {
			if (!err || !fs.existsSync(filepath)) {
				return cb(null, file);
			}
			rimraf(filepath, function (err) {
				if (!err || !fs.existsSync(filepath)) {
					return cb(null, file);
				}
				rimraf(filepath, function (err) {
					if (!err || !fs.existsSync(filepath)) {
						return cb(null, file);
					}
					return cb(err);
				});
			});
		});
	});
};
