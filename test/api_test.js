var request = require('request'),
		should = require('should');

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

	var testIfExists = function(test_pattern) {
		request.get(url + '/api/patterns/1', function (err, res, body) {
			if(err) {
				done(err);
			}
			else {
				res.statusCode.should.be.equal(200);
				res.should.be.json;
				should.exist(body);
				var pattern = JSON.parse(body);
				pattern.should.have.property('id', test_pattern.id);
				pattern.should.have.property('name', test_pattern.name);
				pattern.should.have.property('category', test_pattern.category);
				pattern.should.have.property('intent', test_pattern.intent);
				pattern.should.have.property('motivation', test_pattern.motivation);
				pattern.should.have.property('applicability', test_pattern.applicability);
				pattern.should.have.property('structure', test_pattern.structure);
			}
		});
	};

	var deletePatternById = function(id) {
		var del_options = {
			host: "localhost",
			port: 8010,
			method: "DELETE",
			path: "/api/patterns/3",
			headers: {
				"Accept": "*/*",
				"Accept-Charset":"ISO-8859-1,utf-8;q=0.7,*;q=0.3",
				"Accept-Encoding": "gzip,deflate,sdch",
				"Accept-Language": "es-ES,es;q=0.8",
				"Connection": "keep-alive",
				"Host": "localhost:8010",
				"Origin": "http://localhost:8010",
				"Referer": "http://localhost:8010/rest_test.html",
				"User-Agent":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/537.4",
				"X-Requested-With": "XMLHttpRequest"
			}
		};
		var callback = function(error, response, body) {
			if(error) {
				console.log('ERROR AL HACER LA LLAMADA A DELETE!!!!!');
			}
			else {
				console.log("LLAMADA REALIZADA CORRECTAMENTE");
			}
		};
		var http = require('http');
		console.log('making DELETE call to ' + del_options.path + ' waiting for callback...');
		console.log(http.request);
		var req = http.request(del_options, callback);
		req.end();
		console.log("DELETE IS NOT WORKING: DELETE MANUALLY THE PATTERN WITH ID = " + id);
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
					patterns.should.includeEql(test_pattern1);
					patterns.should.includeEql(test_pattern2);
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
			testIfExists(test_pattern1);
			done();
		});
	});
	
	describe('Insert new pattern with id = 3', function() {
		it('should be succesful', function(done){
			//The url we want is `www.nodejitsu.com:1337/`
			var post_options = {
				method: 'POST',
				uri: url + '/api/patterns',
				form: new_pattern,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			var post_callback = function(error, response, body) {
				done();
			};
			request(post_options, post_callback);
		});
		after(function() {
			deletePatternById(new_pattern.id);
		});
	});
});