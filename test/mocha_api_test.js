var modules_url = '../node_modules';
var request = require(modules_url + '/request'),
	should = require(modules_url + '/should');

var url = 'http://localhost:8010';

var test_pattern1 = {
    "id": 1,
    "name": "Singleton",
    "category": "Creational",
    "intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",
    "motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
    "applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
    "structure": "Cambiar por BLOB"
  };

var test_pattern1_modif = {
    "id": 1,
    "name": "MODIF Singleton",
    "category": "MODIF Creational",
    "intent": "MODIF Ensure a class only has one instance, and provide a global point of acg cess to it",
    "motivation": "MODIF It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
    "applicability": "MODIF there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
    "structure": "MODIF Cambiar por BLOB"
	};

var test_pattern2 = {
    "id": 2,
    "name": "Prototype",
    "category": "Creational",
    "intent": "Specify the kinds of objects to create using a prototypical instance, and create",
    "motivation": "Use the Prototype Pattern when a client needs to create  a set of",
    "applicability": "Use the Prototype pattern when a system should be independent of how its products",
    "structure": "Cambiar por BLOB"
  };

 var new_pattern = {
		"id": 3,
		"name": "Factory Method",
		"category": "Creational",
		"intent": "Define an interface for creating an object, but let subclasses decide which class to instantiate. Lets a class defer instantiation to subclasses",
		"motivation": "",
		"applicability": "",
		"structure": ""
	};

describe('Tests for patterns API, ', function() {

	var testIfExists = function(test_pattern, cb) {
		request.get(url + '/api/patterns/' + test_pattern.id, function (err, res, body) {
			if(err) {
				console.log("error");
				done(err);
			}
			else {
				res.statusCode.should.be.equal(200);
				should.exist(body);
				var pattern = JSON.parse(body);
				pattern.should.have.property('id', test_pattern.id);
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
		request.get(url + '/api/patterns/' + test_pattern.id, function (err, res, body) {
			res.statusCode.should.be.equal(404);
			cb();
		});
	};

	var deletePatternById = function(id, cb) {

		var del_options = {
			method: 'DELETE',
			uri: url + '/api/patterns/3',
			form: new_pattern,
			port: 8010,
			headers: {
				"Content-Type": "application/json"
			}
		};
		request(del_options, cb);
	};

	describe('Get all patterns test', function(){
		it('should be successful.', function(done){
			request.get(url + '/api/patterns', function (err, res, body) {
				if(err) {
					done(err);
				}
				else {
					res.statusCode.should.be.equal(200);
					res.should.be.json;
					should.exist(body);
					var patterns = JSON.parse(body);
					patterns.should.be.an.instanceOf(Array);
					patterns.should.have.length(2);
					
					var aux_pattern;
					for (var i = 0; i < patterns.length; i++) {
						if (i === 0) {
							aux_pattern = test_pattern1;
						} else {
							aux_pattern = test_pattern2;
						}
						patterns[i].id = aux_pattern.id;
						patterns[i].name = aux_pattern.name;
						patterns[i].category = aux_pattern.category;
						patterns[i].intent = aux_pattern.intent;
						patterns[i].motivation = aux_pattern.motivation;
						patterns[i].applicability = aux_pattern.applicability;
						patterns[i].structure = aux_pattern.structure;
					}
					done();
				}
			});
		});
	});

	describe('Get number of patterns test', function(){
		it('should be successful.', function(done){
			request.get(url + '/api/patterns/count', function (err, res, body) {
				if(err) {
					done(err);
				}
				else {
					res.statusCode.should.be.equal(200);
					res.should.be.http;
					should.exist(body);
					var count = parseInt(body);
					count.should.equal(2);
					done();
				}
			});
		});
	});

	describe('Get pattern with id = 1 test', function() {
		it('should be succesful', function(done){
			testIfExists(test_pattern1, function() {
				done();
			});
		});
	});

	describe('Insert new pattern with id = 3', function() {
		it('should be succesful', function(done){
			var post_options = {
				method: 'POST',
				uri: url + '/api/patterns',
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
					deletePatternById(new_pattern.id, function() {
						testIfNotExists(new_pattern, function() {
							done();
						});
					});
				});
			};
			request(post_options, post_callback);
		});
	});

	describe('Update pattern with id = 1 test', function() {
		it('should be succesful', function(done){
			var post_options = {
				method: 'PUT',
				uri: url + '/api/patterns/1',
				form: test_pattern1,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			var put_callback = function(error, res, body) {
				res.statusCode.should.be.equal(200);
				done();
			};
			request(post_options, put_callback);
		});
	});
});