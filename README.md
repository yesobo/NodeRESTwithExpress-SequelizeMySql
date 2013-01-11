Node.js REST Service to MySql Local database with Express + Sequelize
=====================================================================
----------------
TODO:
=====

- https://kanbanflow.com/board/57b0cbae7ac915c37d6cf121ea567fb8
- (in process) Apply the daos branch purposes on master branch.
	- (in process) convert database and routes files in one routes file and multiple dao files.
		- improve the tests at mocha_api_test.js. 
			1. Watch Video [teach a dog to rest](http://www.youtube.com/watch?v=o-4mibDn_aU).
			2. Fill Catch note 
		- convert database.coffee/js, routesSequelize.coffe/js and models.coffee/js on daos/SequelizeDao.coffe/js

- organize files as: http://openmymind.net/NodeJS-Module-Exports-And-Organizing-Express-Routes/

- New branch mongoHQdb (it will possibly dissapear because of daos branch improvements):

- Api integration tests:
	- Create a test with Jasmine. 
	- finish tests with vows, qUnit and mocha including error codes.
	- Document API REST with swagger

References:
===========
- Uses Sequelize (http://www.sequelizejs.com/). Good file design but uses express-resource: http://www.ziggytech.net/technology/web-development/experiences-with-node-js-porting-a-restful-service-written-in-java/

- Create a REST service with express3 (instead of express-resource), testing with jQuery: http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/

- REST with node + express + mongodb: http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/

- Mocha.js + should.js + request.js = nice tool for JSON api testing. (http://blog.kardigen.org/2012/03/mochajs-shouldjs-requestjs-nice-tool.html

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
