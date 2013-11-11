/*jshint node:true */

"use strict";

var es = require('event-stream'),
	rimraf = require('rimraf'),
	fs = require('fs');

module.exports = function(){
	return es.map(function (file, cb){
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
