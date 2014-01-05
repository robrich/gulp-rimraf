/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var rimraf = require('../');
var fs = require('fs');
var should = require('should');
var path = require('path');
require('mocha');

describe('gulp-rimraf', function() {
	describe('rimraf()', function() {
		var tempFileContent = 'A test generated this file and it is safe to delete';
		var cwd = process.cwd();

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

		it('cannot remove the current working directory', function (done) {
		    var stream = rimraf();

		    stream.on('end', function () {
		    	// Test that cwd is not removed
		    	fs.existsSync(cwd).should.equal(true);
		    	done();
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: cwd
		    });

		    stream.end();
		});

		it('cannot delete a folder outside the current working directory without force', function (done) {
		    var stream = rimraf();
		    var tempFolder = path.resolve(cwd, '../gulp-rimrafTemp/');

		    if (!fs.existsSync(tempFolder)) { fs.mkdirSync(tempFolder); }

		    stream.on('end', function () {
		    	var exists = fs.existsSync(tempFolder);
		    	exists.should.equal(true);
		    	if (exists) {
		    		fs.unlink(tempFolder, function () {
		        		done();
		        	});
	    		} else {
	    			done();
	    		}
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: tempFolder
		    });

		    stream.end();
		});

		it('cannot delete a file outside the current working directory without force', function (done) {
		    var stream = rimraf();
		    var tempFile = path.resolve(cwd, '../temp.txt');

		    if (!fs.existsSync(tempFile)) { fs.writeFileSync(tempFile, tempFileContent); }

		    stream.on('end', function () {
		    	var exists = fs.existsSync(tempFile);
		    	exists.should.equal(true);
		    	if (exists) {
		    		fs.unlink(tempFile, function () {
		        		done();
		        	});
	    		} else {
	    			done();
	    		}
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: tempFile
		    });

		    stream.end();
		});

		it('can delete a folder outside the current working directory with force', function (done) {
			var stream = rimraf({ force: true });
		    var tempFolder = path.resolve(cwd, '../gulp-rimrafTemp/');

		    if (!fs.existsSync(tempFolder)) { fs.mkdirSync(tempFolder); }

		    stream.on('end', function () {
		    	fs.existsSync(tempFolder).should.equal(false);
		    	done();
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: tempFolder
		    });

		    stream.end();
		});

		it('can delete a file outside the current working directory with force', function (done) {
			var stream = rimraf({ force: true });
		    var tempFile = path.resolve(cwd, '../temp.txt');

		    if (!fs.existsSync(tempFile)) { fs.writeFileSync(tempFile, tempFileContent); }

		    stream.on('end', function () {
		    	fs.existsSync(tempFile).should.equal(false);
		    	done();
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: tempFile
		    });

		    stream.end();
		});

		it('supports resolved file.path', function (done) {
			var stream = rimraf();
		    var resolvedTempFile = path.resolve(cwd, './tempResolved.txt');

		    if (!fs.existsSync(resolvedTempFile)) { fs.writeFileSync(resolvedTempFile, tempFileContent); }

		    stream.on('end', function () {
		    	fs.existsSync(resolvedTempFile).should.equal(false);
		    	done();
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: resolvedTempFile
		    });

		    stream.end();
		});

		it('supports unresolved file.path', function (done) {
			var stream = rimraf();
		    var unresolvedTempFile = './tempUnresolved.txt';

		    if (!fs.existsSync(unresolvedTempFile)) { fs.writeFileSync(unresolvedTempFile, tempFileContent); }

		    stream.on('end', function () {
		    	fs.existsSync(unresolvedTempFile).should.equal(false);
		    	done();
		    });

		    // Act
		    stream.write({
		    	cwd: cwd,
		    	path: unresolvedTempFile
		    });

		    stream.end();
		});
	});
});
