var vows = require('vows'),
		request = require('request'),
		assert = require('assert'),

		url = "http://localhost:8010",
		new_pattern = {
			"id": 3,
			"name": "Factory Method",
			"category": "Creational",
			"intent": "Define an interface for creating an object, but let subclasses decide which class to instantiate. Lets a class defer instantiation to subclasses",
			"motivation": "",
			"applicability": "",
			"structure": ""
		},
		del_options = {
			method: 'DELETE',
			uri: url + '/api/patterns/3',
			form: new_pattern,
			port: 8010,
			headers: {
				"Content-Type": "application/json"
			}
		},
		deleted = false,
		assert_deletion_loop = function(error, res, body) {
			console.log('delete response statusCode = ' + res.statusCode);
			if (res.statusCode === 404) {
				console.log ("inserted pattern not foud yet");
				request(del_options, assert_deletion_loop);
			}
			else {
				console.log ("pattern deleted");
				deleted = true;
				assert.equal(deleted, true);
			}
		};


vows.describe('patterns API test').addBatch({
	'Adding pattern with id = 3': {
		topic: function() {
			var post_options = {
				method: 'POST',
				uri: url + '/api/patterns',
				form: new_pattern,
				port: 8010,
				headers: {
					"Content-Type": "application/json"
				}
			};
			console.log("making insertion");
			request(post_options, this.callback);
		},
		'should respond with a 200 ok': function (error, res, body) {
			assert.equal(res.statusCode, 200);
		},
		'after a succesful insertion': {
			topic: function() {
				console.log("calling deletion");
				request(del_options, this.callback);
			},
			'should have deleted the pattern': assert_deletion_loop
		}
	}
}).run();