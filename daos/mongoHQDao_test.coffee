modules_url = '../node_modules'

MongoDBConnector = require "./mongoHQDao.js"

mongodb = require 'mongodb'
should = require "#{modules_url}/should"

describe 'Tests for MongoDBConnector', ->
	daoObj = null
	in_db_patterns_names = {
		"Singleton" : "Singleton",
		"Prototype" : "Prototype"
	}

	test_pattern1 =
	    "name": "Singleton",
	    "category": "Creational",
	    "intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",
	    "motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
	    "applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
	    "structure": "Cambiar por BLOB"

  	test_pattern2 =
	    "name": "Prototype",
	    "category": "Creational",
	    "intent": "Specify the kinds of objects to create using a prototypical instance, and create",
	    "motivation": "Use the Prototype Pattern when a client needs to create  a set of",
	    "applicability": "Use the Prototype pattern when a system should be independent of how its products",
	    "structure": "Cambiar por BLOB"

	new_pattern =
		"name": "Factory Method",
		"category": "Creational",
		"intent": "Define an interface for creating an object, but let subclasses decide which class to instantiate. Lets a class defer instantiation to subclasses",
		"motivation": "",
		"applicability": "",
		"structure": ""

	before (done) ->
		daoObj = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 10001
		console.log "deleting collection..."
		daoObj.deleteAll (err) ->
			console.log "collection deleted."
			console.log "inserting pattern1"
			daoObj.insert test_pattern1, (err, docs) ->
				console.log "pattern1 inserted"
				console.log "inserting pattern2"
				daoObj.insert test_pattern2, (err, docs) ->
					console.log "DB restarted"
					done()

	beforeEach ->
		daoObj = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 10001

	it.only 'Can be instatiated with paraneters', (done) ->
		daoObj.should.have.property 'dbName', 'design_patterns'
		daoObj.should.have.property 'host', 'alex.mongohq.com'
		daoObj.should.have.property 'port', 10001
		daoObj.should.have.property 'db'
		should.exist daoObj.db
		daoObj.db.should.be.an.instanceof mongodb.Db
		done()
	it 'findAll returns the collection', (done) ->
		daoObj.findAll (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 2
			done()
	it "count returns my collection's number", (done) ->
		daoObj.count (err, count) ->
			should.strictEqual count, 2
			done()

	it "findByName with name = #{in_db_patterns_names.Singleton} returns the #{in_db_patterns_names.Singleton} pattern", (done) ->
		daoObj.findByName in_db_patterns_names.Singleton, (err, item) ->
			item.should.have.property 'name', 'Singleton'
			done()
	it "findByName with name = 'NoPattern' returns 404 error and {'message': 'document not found'}", (done) ->
		daoObj.findByName 'NoPattern', (err, item) ->
			should.strictEqual err, 404
			item.should.have.property 'message', 'document not found'
			done()

	it "insert a new document (#{new_pattern.name}) returns the document", (done) ->
		daoObj.insert new_pattern, (err, docs) ->
			docs[0].should.have.property 'name', new_pattern.name
			done()
	it "insert existing document with name = #{in_db_patterns_names.Singleton}", (done) ->
		daoObj.insert test_pattern1, (err, docs) ->
			should.strictEqual err, 400
			docs.should.have.property 'message', 'A document already exists with that id'
			done()
	it "insert document with empty name returns 400 error and message", (done) ->
		test_pattern1.name = "";
		daoObj.insert test_pattern1, (err, docs) ->
			should.strictEqual err, 400
			docs.should.have.property 'message', 'You must insert an id value'
			done()
		test_pattern1.name = "Singleton"

	it "update the existing document '" + new_pattern.name + "' changes the document at database", (done) ->
		old_category = new_pattern.category
		new_category = "Modified Category"
		new_pattern.category = new_category;
		daoObj.update new_pattern, (err, item) ->
			daoObj.findByName new_pattern.name, (err, item) ->
				item.should.have.property 'category', new_category
				done()
		new_pattern.category = old_category
	it "update the document 'NoDocument' (does'nt exist) returns 404 and document not found", (done) ->
		old_name = new_pattern.name
		new_pattern.name = 'NoDocument'
		daoObj.update new_pattern, (err, item) ->
			should.strictEqual err, 404
			item.should.have.property 'message', "document not found"
			done()
		new_pattern.name = old_name	

	it "delete the existing document '" + new_pattern.name + "' makes the db to have the original elements", (done) ->
		daoObj.delete new_pattern.name, (err, item) ->
			daoObj.count (err, count) ->
				should.strictEqual count, 2
				daoObj.findAll (err, items) ->
					items.should.be.an.instanceOf Array
					items.should.have.length 2
					in_db_patterns_names.should.have.property items[0].name
					in_db_patterns_names.should.have.property items[1].name
					done()
	it "delete the document 'NoDocument' (does'nt exist) returns 404 and document not found", (done) ->
		daoObj.delete 'NoDocument', (err, item) ->
			should.strictEqual err, 404
			item.should.have.property 'message', "document not found"
			done()

	it "deleteAll results on an empty collection", (done) ->
		daoObj.deleteAll (err) ->
			daoObj.count (err, count) ->
				should.strictEqual count, 0
				done()