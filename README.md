#Node.js RESTful API with MySql/MongoHQ database with Express + Sequelize#
_________________

##TODO:##

- https://kanbanflow.com/board/57b0cbae7ac915c37d6cf121ea567fb8
- (in process) Apply the daos branch purposes on master branch.
	- (in process) convert database and routes files in one routes file and multiple dao files.
		- improve the tests at mocha_api_test.js. 
			1. Watch Video [teach a dog to rest](http://www.youtube.com/watch?v=o-4mibDn_aU).
			2. Fill Catch note 
		- convert database.coffee/js, routesSequelize.coffe/js and models.coffee/js on daos/SequelizeDao.coffe/js

- organize files as: http://openmymind.net/NodeJS-Module-Exports-And-Organizing-Express-Routes/

- New branch mongoHQdb (it will possibly dissapear because of daos branch improvements):

- Run tests on [testacular](https://github.com/vojtajina/testacular/)

- Api integration tests:
	- Create a test with Jasmine. 
	- finish tests with vows, qUnit and mocha including error codes.
	- Document API REST with swagger

##References:##

- Uses Sequelize (http://www.sequelizejs.com/). Good file design but uses express-resource: http://www.ziggytech.net/technology/web-development/experiences-with-node-js-porting-a-restful-service-written-in-java/

- Create a REST service with express3 (instead of express-resource), testing with jQuery: http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/

- REST with node + express + mongodb: http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/

- Mocha.js + should.js + request.js = nice tool for JSON api testing. (http://blog.kardigen.org/2012/03/mochajs-shouldjs-requestjs-nice-tool.html

- Testing with QUnit (the only one with good ajax testing) http://www.ajaxprojects.com/ajax/tutorialdetails.php?itemid=894

##NOTES:##

- Server created at http://localhost:8010
- CoffeeScript implemented.
- Tested with mocha + request + should.js (see TODO)
- Tested with vows + request + assert (see TODO)
- Tested with QUnit (see TODO)

**express-resource is NOT COMPATIBLE with express3 so I used express for the routings**

##API reference##

###/patterns (GET)###

- **DESCRIPTION** 	Returns all patterns
- **URL STRUCTURE** 	`...[api_url]/patterns`
- **METHOD**		GET
- **RETURNS**		A list of all patterns patterns on the current revision
			The HTTP response contains all patterns in a JSON array

    *Sample JSON return value*  
<pre>
    [  
    {  
	    "name": "Singleton",  
    	"category": "Creational",  
    	"intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",  
    	"motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",  
    	"applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",  
    	"structure": "Cambiar por BLOB",  
        "_id": "50f6f74fe4f707ca70000001"  
    },  
    {  
        "name": "Prototype",  
        "category": "Creational",  
        "intent": "Specify the kinds of objects to create using a prototypical instance, and create",  
        "motivation": "Use the Prototype Pattern when a client needs to create  a set of",  
        "applicability": "Use the Prototype pattern when a system should be independent of how its products",  
        "structure": "Cambiar por BLOB",  
        "_id": "50f6f74fe4f707ca70000002"  
    }  
    ]
</pre>
- **ERRORS**		

###/patterns (POST)###

- **DESCRIPTION** 	inserts a new pattern
- **URL STRUCTURE** 	`...[api_url]/patterns`
- **METHOD**		POST
- **REQUEST BODY**      _required_ A JSON object with the new pattern's data with unless the __name__ field
- **RETURNS**		status code 200
- **ERRORS**		400  Error inserting pattern

###/patterns (PUT)###

- **DESCRIPTION** 	updates a collection of patterns
- **URL STRUCTURE** 	`...[api_url]/patterns`
- **METHOD**		PUT
- **REQUEST BODY**      _required_ A JSON array object with the collecion of patterns to be updated.
- **RETURNS**		a JSON object with the number of total updated patterns

    *Sample JSON return value*  
<pre>
    {
        "updated_patterns": 2
    }</pre>

###/patterns/:name (DEL)###

- **DESCRIPTION** 	Deletes all patterns.
- **URL STRUCTURE** 	`...[api_url]/patterns`
- **METHOD**		DEL
- **RETURNS**           a JSON object with the number of total deleted patterns.

    *Sample JSON return value*  
<pre>
    {
        "deleted_patterns": 3
    }</pre>

###/patterns/count (GET)###

- **DESCRIPTION** 	returns the number of patterns
- **URL STRUCTURE** 	`...[api_url]/patterns/count`
- **METHOD**		GET
- **RETURNS**		A JSON object with the number of patterns in our database.

    *Sample JSON return value*  
<pre>
    {
        "number_of_patterns": 4
    }</pre>

###/patterns/:name (GET)###

- **DESCRIPTION** 	Returns information about the pattern specified by the name parameter
- **URL STRUCTURE** 	`...[api_url]/patterns/:name`
- **METHOD**		GET
- **PARAMETERS**        _name:_ Used to specify the name of the pattern to be returned
- **RETURNS**		A JSON object with information about the parameter specified by the :name attribute.

    *Sample JSON return value*  
<pre>
    {
        "name": "Singleton",
        "category": "Creational",
        "intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",
        "motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
        "applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
        "structure": "Cambiar por BLOB",
        "_id": "50f6f74fe4f707ca70000001"
    }</pre>
- **ERRORS**           404 The pattern specified by the name parameter does'nt exist in the database

###/patterns/:name (PUT)###

- **DESCRIPTION** 	Updates the pattern specified by the name parameter
- **URL STRUCTURE** 	`...[api_url]/patterns/:name`
- **METHOD**		PUT
- **PARAMETERS**        _name:_ Used to specify the name of the pattern to be updated
- **REQUEST BODY**      _required_ A JSON object containing the new information about the pattern to be updated
- **RETURNS**		A JSON object with the new information about the updated parameter specified by the :name attribute.

    *Sample JSON return value*  
<pre>
    {
        "name": "Singleton",
        "category": "Creational",
        "intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",
        "motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
        "applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
        "structure": "Cambiar por BLOB",
        "_id": "50f6f74fe4f707ca70000001"
    }</pre>
- **ERRORS**           404 The pattern specified by the name parameter does'nt exist in the database

###/patterns/:name (DEL)###

- **DESCRIPTION** 	Deletes the pattern specified by the name parameter
- **URL STRUCTURE** 	`...[api_url]/patterns/:name`
- **METHOD**		DEL
- **PARAMETERS**        _name:_ Used to specify the name of the pattern to be deleted
- **ERRORS**           500 There was an error deleting the specified pattern.
