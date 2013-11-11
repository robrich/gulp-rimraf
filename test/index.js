/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var rimraf = require('../');
var fs = require('fs');
var should = require('should');
require('mocha');

describe('gulp-rimraf', function() {
	describe('rimraf()', function() {
		var tempFileContent = 'A test generated this file and it is safe to delete';

		it('should pass file structure through', function(done) {
			// Arrange
			var tempFile = './temp.txt';
			var tempFileShort = 'temp.txt';

			var stream = rimraf();
			var fakeFile = {
				path: tempFile,
				shortened: tempFileShort,
				contents: new Buffer(tempFileContent)
			};

			// Assert
			stream.on('data', function(actualFile){
				// Test that content passed through
				should.exist(actualFile);
				should.exist(actualFile.path);
				should.exist(actualFile.shortened);
				should.exist(actualFile.contents);
				actualFile.path.should.equal(tempFile);
				actualFile.shortened.should.equal(tempFileShort);
				String(actualFile.contents).should.equal(tempFileContent);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});

		it('should delete a file', function(done) {
			// Arrange
			var tempFile = './temp.txt';
			var tempFileShort = 'temp.txt';
			fs.writeFileSync(tempFile, tempFileContent);
			fs.existsSync(tempFile).should.equal(true);

			var stream = rimraf();
			var fakeFile = {
				path: tempFile,
				shortened: tempFileShort,
				contents: new Buffer(tempFileContent)
			};

			// Assert
			stream.once('end', function(/*actualFile*/){
				// Test that file is gone
				fs.existsSync(tempFile).should.equal(false);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});

		it('should delete an empty folder', function(done) {
			// Arrange
			var tempDir = './tempDir';
			var tempDirShort = 'tempDir';
			fs.mkdirSync(tempDir);
			fs.existsSync(tempDir).should.equal(true);
			// TODO: should be a dir

			var stream = rimraf();
			var fakeFile = {
				path: tempDir,
				shortened: tempDirShort,
				contents: ''
			};

			// Assert
			stream.once('end', function(/*actualFile*/){
				// Test that dir is gone
				fs.existsSync(tempDir).should.equal(false);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});

		it('should delete a folder with files', function(done) {
			// Arrange
			var tempDir = './tempDir';
			var tempDirShort = 'tempDir';
			fs.mkdirSync(tempDir);
			fs.existsSync(tempDir).should.equal(true);
			fs.writeFileSync(tempDir+'/file1.txt', tempFileContent);
			fs.writeFileSync(tempDir+'/file2.txt', tempFileContent);

			var stream = rimraf();
			var fakeFile = {
				path: tempDir,
				shortened: tempDirShort,
				contents: ''
			};

			// Assert
			stream.once('end', function(/*actualFile*/){
				// Test that dir is gone
				fs.existsSync(tempDir).should.equal(false);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});

		it('should not error if target file does not exist', function(done) {
			// Arrange
			var tempFile = './noexist.txt';
			var tempFileShort = 'noexist.txt';
			fs.existsSync(tempFile).should.equal(false);

			var stream = rimraf();
			var fakeFile = {
				path: tempFile,
				shortened: tempFileShort,
				contents: new Buffer(tempFileContent)
			};

			// Assert
			stream.once('end', function(/*actualFile*/){
				// Test that file is gone
				fs.existsSync(tempFile).should.equal(false);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});

		it('should not error if target dir does not exist', function(done) {
			// Arrange
			var tempDir = './noexistDir';
			var tempDirShort = 'noexistDir';
			fs.existsSync(tempDir).should.equal(false);

			var stream = rimraf();
			var fakeFile = {
				path: tempDir,
				shortened: tempDirShort,
				contents: ''
			};

			// Assert
			stream.once('end', function(/*actualFile*/){
				// Test that dir is gone
				fs.existsSync(tempDir).should.equal(false);
				done();
			});

			// Act
			stream.write(fakeFile);
			stream.end();
		});
	});
});
