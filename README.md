Node.js REST Service to MySql Local database with Express + Sequelize
=====================================================================
----------------
TODO:
=====
- Api integration tests:
	
	*NOT ABLE TO MAKE REQUEST.PUT AND DELETE NODE REQUESTS ON MOCHA TESTS WORK, but they work testing them with jQuery at rest_test.html*
	
	- resources:
		- http://brianstoner.com/blog/testing-in-nodejs-with-mocha/
		
References:
===========
	-> Uses Sequelize (http://www.sequelizejs.com/). Good file design but uses express-resource: http://www.ziggytech.net/technology/web-development/experiences-with-node-js-porting-a-restful-service-written-in-java/

	-> Create a REST service with express3 (instead of express-resource), testing with jQuery: http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/

	-> REST with node + express + mongodb: http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/

	-> Mocha.js + should.js + request.js = nice tool for JSON api testing. (See TODO) http://blog.kardigen.org/2012/03/mochajs-shouldjs-requestjs-nice-tool.html

NOTES:
=====
- Server created at http://localhost:8010
- CoffeeScript implemented.
- Tested with mocha + require + should.js (see TODO)

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




