var modules_url = '../node_modules';
var request = require(modules_url + '/request'),
	should = require(modules_url + '/should'),
	util = require('util'),
	MongoDBConnector = require('../daos/mongoHQDao.js'),
	test_patterns = require('./test_patterns.js');

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

	// Restart the DB with 2 test objects
	before(function(done) {
		var daoObj = new MongoDBConnector('design_patterns', 'alex.mongohq.com', 10001);
		console.log("deleting collection...");
		daoObj.deleteAll( function(err) {
			console.log("collection deleted.");
			console.log("inserting pattern1");
			daoObj.insert(test_pattern1, function(err, docs) {
				console.log("pattern1 inserted");
				console.log("inserting pattern2");
				daoObj.insert(test_pattern2, function(err, docs) {
					console.log("DB restarted");
					done();
				});
			});
		});
	});
	
	describe('Read patterns list with GET /patterns', function(){
		it('should return statusCode 200 and a json array with the 2 test elements', function(done){
			request.get(url + '/patterns', function (err, res, body) {
				if(err) {
					done(err);
				}
				else {
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

	describe('Count patterns with GET /patterns/count ', function(){
		it('should return statusCode 200 and a JSON object {"number_of_patterns": 2}.', function(done){
			request.get(url + '/patterns/count', function (err, res, body) {
				if(err) {
					done(err);
				}
				else {
					res.statusCode.should.be.equal(200);
					var dummy = res.should.be.http;
					should.exist(body);
					var resp = JSON.parse(body);
					resp.should.have.property("number_of_patterns", 2);
					done();
				}
			});
		});
	});

	describe('Get pattern by name with GET /patterns/' + test_pattern1.name + ' ', function() {
		it('should return 200 and the specified element', function(done){
			testIfExists(test_pattern1, function() {
				done();
			});
		});
	});

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