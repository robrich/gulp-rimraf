/*jshint node:true */

"use strict";

var es = require('event-stream'),
	rimraf = require('rimraf');

module.exports = function(){
	return es.map(function (file, cb){
		rimraf(file.path, function (err) {
			cb(err, file);
		});
	});
};
