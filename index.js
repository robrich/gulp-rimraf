/*jshint node:true */

"use strict";

var map = require('map-stream'),
	rimraf = require('rimraf'),
	fs = require('fs');

module.exports = function(){
	return map(function (file, cb){
		rimraf(file.path, function (err) {
			if (!err || !fs.existsSync(file.path)) {
				return cb(null, file);
			}
			rimraf(file.path, function (err) {
				if (!err || !fs.existsSync(file.path)) {
					return cb(null, file);
				}
				rimraf(file.path, function (err) {
					if (!err || !fs.existsSync(file.path)) {
						return cb(null, file);
					}
					return cb(err);
				});
			});
		});
	});
};
