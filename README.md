Node.js REST Service to MySql Local database with Express + Sequelize
=====================================================================
----------------
TODO:
=====
- Api tests:
	resources:
		- http://blog.nodejitsu.com/rest-easy-test-any-api-in-nodejs
		- http://stackoverflow.com/questions/7127226/node-js-testing-restful-api-vows-js
		- http://vowsjs.org/

- document API on README.md

References:
===========
	-> Uses Sequelize (http://www.sequelizejs.com/). Good file design but uses express-resource: http://www.ziggytech.net/technology/web-development/experiences-with-node-js-porting-a-restful-service-written-in-java/

	-> Create a REST service with express3 (instead of express-resource), testing with jQuery: http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/

	-> REST with node + express + mongodb: http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/
----------------
NOTES:
=====
Server created at http://localhost:8010
CoffeeScript implemented.

express-resource is NOT COMPATIBLE with express3 so I just use express for the routings
----------------
API
===
GET api/patterns: get all the patterns as JSON
GET api/patterns/count: get the number of patterns as text
GET api/patterns/{id}: get pattern by id as JSON
POST api/patterns: insert new pattern




