/*jshint node:true */

"use strict";

var map = require('map-stream'),
	rimraf = require('rimraf'),
	fs = require('fs'),
	gutil = require('gulp-util'),
	path = require('path');

module.exports = function(options){
	return map(function (file, cb){
		var cwd = file.cwd || process.cwd();
		// For safety resolve paths always resolve pathss
		var filepath = path.resolve(cwd, file.path);
		var starts = new RegExp('^' + cwd + '/');

    	if (starts.test(filepath) && filepath !== cwd || (options ? options.force : false)) {	
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
		} else if (filepath === cwd) {
			gutil.log('gulp-rimraf: Cannot delete the current working directory. (' + filepath + ')');
      		cb(null, file);
		} else {
			gutil.log('gulp-rimraf: Cannot delete files or folders outside the current working directory. (' + filepath + ')');
      		cb(null, file);
		}
	});
};
