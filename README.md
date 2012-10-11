Node.js REST Service to MySql Local database with Express + Sequelize
=====================================================================
----------------
TODO:
=====
- New branch mongoHQdb: (current on work)
	
	
- Api integration tests:
	*NOT ABLE TO MAKE REQUEST.PUT AND DELETE NODE REQUESTS ON MOCHA TESTS WORKING, but they work testing them with vows, qunit and jQuery at rest_test.html 
    TRY WITH Restify ref: http://tech.flurry.com/regression-testing-api-services-with-restify*

	- Create a test with Jasmine. 
	- finish tests with vows, qUnit and mocha including error codes.
	- Document API REST with swagger

References:
===========
- Uses Sequelize (http://www.sequelizejs.com/). Good file design but uses express-resource: http://www.ziggytech.net/technology/web-development/experiences-with-node-js-porting-a-restful-service-written-in-java/

- Create a REST service with express3 (instead of express-resource), testing with jQuery: http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/

- REST with node + express + mongodb: http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/

- Mocha.js + should.js + request.js = nice tool for JSON api testing. (See TODO) http://blog.kardigen.org/2012/03/mochajs-shouldjs-requestjs-nice-tool.html

- Testing with QUnit (the only one with good ajax testing) http://www.ajaxprojects.com/ajax/tutorialdetails.php?itemid=894

NOTES:
=====
- Server created at http://localhost:8010
- CoffeeScript implemented.
- Tested with mocha + request + should.js (see TODO)
- Tested with vows + request + assert (see TODO)
- Tested with QUnit (see TODO)

express-resource is NOT COMPATIBLE with express3 so I used express for the routings
----------------
API
===
- GET api/patterns: 			get all the patterns as JSON
- GET api/patterns/count: get the number of patterns as text
- GET api/patterns/{id}: 	get pattern by id as JSON
- POST api/patterns: 			insert new pattern
- PUT api/patterns/{id}: 	update pattern by id
- DELETE api/pattern/{id}:delete pattern by id




