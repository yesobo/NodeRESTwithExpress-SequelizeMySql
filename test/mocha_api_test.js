var modules_url = '../node_modules';
var request = require(modules_url + '/request'),
	should = require(modules_url + '/should'),
	util = require('util'),
	MongoDBConnector = require('../daos/mongoHQDao.js'),
	test_patterns = require('./test_patterns.js'),
	winston = require('winston');

var url = 'http://localhost:8010/api';

var test_pattern1 = test_patterns.singleton;

var test_pattern3_modif = test_patterns.modified_singleton;

var test_pattern2 = test_patterns.prototype_pattern;

var test_pattern4_modif = test_patterns.modified_prototype;
 
var new_pattern = test_patterns.factory_method;

describe('Tests for patterns API, ', function() {

	/* Makes a GET request to /patterns/:name where name is the first parameter's name,
		and checks that the returned object is the same as the first parameter */
	var testIfExists = function(test_pattern, cb, done) {
		request.get(url + '/patterns/' + test_pattern.name, function (err, res, body) {
			if(err) {
				done(err);
			}
			else {
				res.statusCode.should.be.equal(200);
				should.exist(body);
				var pattern = JSON.parse(body);
				pattern.should.have.property('name', test_pattern.name);
				pattern.should.have.property('category', test_pattern.category);
				pattern.should.have.property('intent', test_pattern.intent);
				pattern.should.have.property('motivation', test_pattern.motivation);
				pattern.should.have.property('applicability', test_pattern.applicability);
				pattern.should.have.property('structure', test_pattern.structure);
				cb();
			}
		});
	};

	var testIfNotExists = function(test_pattern, cb) {
		request.get(url + '/patterns/' + test_pattern.name, function (err, res, body) {
			res.statusCode.should.be.equal(404);
			cb();
		});
	};

	var deletePatternByName = function(pName, cb) {
		var del_options = {
			method: 'DELETE',
			uri: url + '/patterns/' + pName,
			form: new_pattern,
			port: 8010,
			headers: {
				"Content-Type": "application/json"
			}
		};
		request(del_options, cb);
	};

	var testReturningFirstDocumentAndSize = function(document, size, res, body, done) {
		res.statusCode.should.be.equal(200);
		var dummy = res.should.be.json;
		should.exist(body);
		var patterns = JSON.parse(body);
		patterns.should.be.an.instanceOf(Array);
		patterns.should.have.length(size);
		patterns[0].should.have.property('name', document.name);
		done();
	};

	/*
	* result: JSON object with key and val properties. ex: {key: "message", val: "no documents found"}
	*/
	var testErrorAndSingleResult = function(errorCode, result, res, body, done) {
		winston.info("testErrorAndSingleResult: INIT");
		res.statusCode.should.be.equal(errorCode);
		var dummy = res.should.be.http;
		should.exist(body);
		var resp = JSON.parse(body);
		resp.should.have.property(result.key, result.val);
		done();
	};

	// Restart the DB with 2 test objects
	before(function(done) {
		var daoObj = new MongoDBConnector('design_patterns', 'alex.mongohq.com', 10001);
		winston.info('deleting collection...');
		daoObj.deleteAll( function(err) {
			if(err !== null) {
				winston.info("ERROR DELETING DB:" + err);
			} else {
				winston.info('collection deleted');
			}
			winston.info('inserting first test document');
			daoObj.insert(test_pattern1, function(err, docs) {
				if(err !== null) {
					winston.info("ERROR INSERTING TEST DOCUMENT 1:" + err);
				} else {
					winston.info('test document 1, inserted');
				}
				winston.info('inserting second test document');
				daoObj.insert(test_pattern2, function(err, docs) {
					if(err !== null) {
						winston.info("ERROR INSERTING TEST DOCUMENT 2:" + err);
					} else {
						winston.info('test document 2, inserted');
					}
					done();
				});
			});
		});
	});
	
	// documented! /patterns (GET)
	describe('Read patterns list with GET /patterns', function(){
		it('should return statusCode 200 and a json array with the 2 test elements', function(done){
			winston.info('GET /patterns test');
			request.get(url + '/patterns', function (err, res, body) {
				winston.info("request callback");
				if(err) {
					winston.info("error " +  err);
					done(err);
				}
				else {
					winston.info("comparing statusCode");
					res.statusCode.should.be.equal(200);
					var dummy = res.should.be.json;
					should.exist(body);
					var patterns = JSON.parse(body);
					patterns.should.be.an.instanceOf(Array);
					patterns.should.have.length(2);
					done();
				}
			});
		});
	});

	// documented pagination limit
	var LIMIT = 1;
	describe('Read patterns with GET /patterns?limit=' + LIMIT, function() {
		it('should return 1 element if limit = ' + LIMIT + ' is specefied at querystring', function(done){
			request.get(url + '/patterns?limit=' + LIMIT, function (err, res, body) {
				if (err) {
					done(err);
				} else {
					res.statusCode.should.be.equal(200);
					var dummy = res.should.be.json;
					should.exist(body);
					var patterns = JSON.parse(body);
					patterns.should.be.an.instanceOf(Array);
					patterns.should.have.length(LIMIT);
					patterns[0].should.have.property('name', test_pattern1.name);
					done();
				}
			});
		});
	});

	// documented pagination. offset
	var OFFSET = 1;
	describe('Read patterns with GET /patterns?offset=' + OFFSET, function() {
		it('should return the second test element', function(done){
			request.get(url + '/patterns?offset=' + OFFSET, function (err, res, body) {
				if (err) {
					done(err);
				} else {
					res.statusCode.should.be.equal(200);
					var dummy = res.should.be.json;
					should.exist(body);
					var patterns = JSON.parse(body);
					patterns.should.be.an.instanceOf(Array);
					patterns.should.have.length(LIMIT);
					patterns[0].should.have.property('name', test_pattern2.name);
					done();
				}
			});
		});
	});

	// documented pagination limit & offset
	describe('Read patterns with GET /patterns?limit=' + LIMIT + '&offset=' + OFFSET, function() {
		it('should return the second test element', function(done){
			request.get(url + '/patterns?limit=' + LIMIT + '&offset=' + OFFSET, function (err, res, body) {
				if (err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern2, LIMIT, res, body, done);
				}
			});
		});
	});

	// documented pagination offset & limit
	describe('Read patterns with GET /patterns?offset=' + OFFSET + '&limit=' + LIMIT, function() {
		it('should return the second test element', function(done){
			request.get(url + '/patterns?offset=' + OFFSET + '&limit=' + LIMIT, function (err, res, body) {
				if(err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern2, LIMIT, res, body, done);
				}
			});
		});
	});

	// documented. Pagination
	var NOT_A_NUMBER = 'j';
	var ERROR_MESSAGE_OFFSET = {
		"message": "'" + NOT_A_NUMBER + "' is not a valid offset value"
	};
	describe('Read patterns with GET (patterns?offset=' + NOT_A_NUMBER, function() {
		it('should return 400 and ' + ERROR_MESSAGE_OFFSET, function(done) {
			request.get(url + '/patterns?offset=' + NOT_A_NUMBER, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(404, {key:"message", val: ERROR_MESSAGE_OFFSET.message}, res, body, done);
				}
			});
		});
	});

	// documented. Pagination
	describe('Read patterns with GET (patterns?offset=' + NOT_A_NUMBER + 'limit=' + LIMIT, function() {
		it('should return 400 and ' + ERROR_MESSAGE_OFFSET, function(done) {
			request.get(url + '/patterns?offset=' + NOT_A_NUMBER + '&limit=' + LIMIT, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(404, {key:"message", val: ERROR_MESSAGE_OFFSET.message}, res, body, done);
				}
			});
		});
	});

	// documented. Pagination
	var ERROR_MESSAGE_LIMIT = {
		"message": "'" + NOT_A_NUMBER + "' is not a valid limit value"
	};
	describe('Read patterns with GET (patterns?limit=' + NOT_A_NUMBER, function() {
		it('should return 400 and' + ERROR_MESSAGE_LIMIT, function(done) {
			request.get(url + '/patterns?limit=' + NOT_A_NUMBER, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(404, {key:"message", val: ERROR_MESSAGE_LIMIT.message}, res, body, done);
				}
			});
		});
	});

	// documented. Pagination
	describe('Read patterns with GET (patterns?limit=' + NOT_A_NUMBER + 'offset=' + OFFSET, function() {
		it('should return 400 and' + ERROR_MESSAGE_LIMIT, function(done) {
			request.get(url + '/patterns?limit=' + NOT_A_NUMBER + '&offset=' + OFFSET, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(404, {key:"message", val: ERROR_MESSAGE_LIMIT.message}, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?name=' + test_pattern1.name, function(){
		it('should return our first test element', function(done){
			request.get(url + '/patterns?name=' + test_pattern1.name, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern1, 1, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?name=' + test_pattern2.name, function(){
		it('should return our second test document', function(done){
			request.get(url + '/patterns?name=' + test_pattern2.name, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern2, 1, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?category=' + test_pattern1.category, function(){
		it('should return our two test documents', function(done){
			request.get(url + '/patterns?category=' + test_pattern1.category, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern1, 2, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?category=' + test_pattern1.category +'&name=' + test_pattern2.name, function(){
		it('should return our second test documents', function(done){
			request.get(url + '/patterns?category=' + test_pattern1.category + '&name=' + test_pattern2.name, function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testReturningFirstDocumentAndSize(test_pattern2, 1, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?category=' + test_pattern1.category +'&name=noName', function(){
		it("should return error 404 and {'message', 'document not found'}", function(done){
			request.get(url + '/patterns?category=' + test_pattern1.category + '&name=noName', function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(404, {key:"message", val: "no documents found"}, res, body, done);
				}
			});
		});
	});

	describe('Search patterns with GET /patterns?noExistsField=failValue', function(){
		it("should return error 404 and {'message', 'document not found'}", function(done){
			request.get(url + '/patterns?noExistsField=failValue', function(err, res, body) {
				if (err) {
					done(err);
				} else {
					testErrorAndSingleResult(400, {key:"message", val: "unsupported query parameter"}, res, body, done);
				}
			});
		});
	});

	// documented /patterns/count (GET)
	describe('Count patterns with GET /patterns/count ', function(){
		it('should return statusCode 200 and a JSON object {"number_of_patterns": 2}.', function(done){
			request.get(url + '/patterns/count', function (err, res, body) {
				if(err) {
					done(err);
				}
				else {
					testErrorAndSingleResult(200, {key:"number_of_patterns", value: 2 }, res, body, done);
				}
			});
		});
	});

	// documented /patterns/:name (GET)
	describe('Get pattern by name with GET /patterns/' + test_pattern1.name + ' ', function() {
		it('should return 200 and the specified element', function(done){
			testIfExists(test_pattern1, function() {
				done();
			});
		});
	});

	// documented /patterns (POST)
	describe('Add new pattern with POST ' + new_pattern + ' to /patterns/'  + new_pattern.name + ' ', function() {
		it('should return statusCode 404 and our new_pattern object must NOT be in our db', function(done){
			var post_options = {
				method: 'POST',
				uri: url + '/patterns/' + new_pattern.name,
				form: new_pattern,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			var post_callback = function(error, res, body) {
				res.statusCode.should.be.equal(404);
				// Check if new_pattern is in the db
				testIfNotExists(new_pattern, function() {
					done();
				});
			};
			request(post_options, post_callback);
		});
	});

	// documented /patterns(POST)
	describe('Add new pattern with POST ' + new_pattern + ' to /patterns ', function() {
		it('should return statusCode 200 and our new_pattern object must be in our db', function(done){
			var post_options = {
				method: 'POST',
				uri: url + '/patterns',
				form: new_pattern,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			var post_callback = function(error, res, body) {
				res.statusCode.should.be.equal(200);
				// Check if new_pattern is in the db
				testIfExists(new_pattern, function() {
					done();
				});
			};
			request(post_options, post_callback);
		});
	});

	// documented /patterns (PUT)
	describe('Update pattern with PUT '+ test_pattern3_modif + ' to /patterns/ ' + test_pattern3_modif.name + ' ', function() {
		it('should return status code 200 and must have changed the element at our collection', function(done){
			var post_options = {
				method: 'PUT',
				uri: url + '/patterns/' + test_pattern3_modif.name,
				form: test_pattern3_modif,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			var put_callback = function(error, res, body) {
				res.statusCode.should.be.equal(200);
				testIfExists(test_pattern3_modif, function() {
					post_options.form = test_pattern1;
					request(post_options, function() {
						done();
					});
				}, done);
			};
			request(post_options, put_callback);
		});
	});

	// documented /patterns/:name (DEL)
	describe('Delete pattern with DEL /patterns/ ' + new_pattern.name + ' ', function() {
		it('should return statusCode 200 and it must not be in our collection', function(done) {
			deletePatternByName(new_pattern.name, function(err, res, body) {
				res.statusCode.should.be.equal(200);
				testIfNotExists(new_pattern, function() {
					done();
				});
			});
		});
	});

	// documented /patterns (PUT)
	describe('Bulk update patterns with PUT a "patterns" JSON collection to /patterns', function() {
		var col;
		/* creates the collection */
		before(function() {
			col = {
				patterns: []
			};
			col.patterns.push(test_pattern1); // Modifies Singleton
			col.patterns.push(test_pattern4_modif); // Modifies Prototype
			col.patterns.push(new_pattern); // Is not in the DB
		});

		it('should return 200 and the number updated patterns', function(done) {
			var post_options = {
				method: 'PUT',
				uri: url + '/patterns',
				body: JSON.stringify(col),
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};

			var put_callback = function(error, res, body) {
				res.statusCode.should.be.equal(200);
				var dummy = res.should.be.json;
				should.exist(body);
				var responseCol = JSON.parse(body);
				should.strictEqual(responseCol.updated_patterns, 2);
				done();
			};
			request(post_options, put_callback);
		});
		it('the patterns must have been updated when checked.', function(done) {
			testIfExists(test_pattern1, function() {
				testIfExists(test_pattern4_modif, function() {
					done();
				}, done);
			}, done);
		});
		it('only updates the patterns that match by name.', function(done) {
			testIfNotExists(new_pattern, function() {
				done();
			});
		});
	});
	
	// documented /patterns (DEL)
	describe('Bulk delete patterns with DEL to /patterns ', function() {
		it('should return 200 a JSON object {"deleted_patterns": 2} and our db should be empty. ', function(done) {
			var del_options = {
				method: 'DELETE',
				uri: url + '/patterns',
				port: 8010
			};
			request(del_options, function(err, req, body) {
				req.statusCode.should.be.equal(200);
				var resp = JSON.parse(body);
				resp.should.have.property("deleted_patterns", 2);
				request.get(url + '/patterns/count', function (err, res, body) {
					var count = JSON.parse(body);
					count.should.have.property("number_of_patterns", 0);
					done();
				});
			});
		});
	});

});