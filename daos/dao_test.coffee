modules_url = '../node_modules'

MongoDBConnector = require "./dao.js"

mongodb = require 'mongodb'
should = require "#{modules_url}/should"

describe 'Tests for MongoDBConnector', ->
	daoObj = null
	new_pattern = {
		"id": 3,
		"name": "Factory Method",
		"category": "Creational",
		"intent": "Define an interface for creating an object, but let subclasses decide which class to instantiate. Lets a class defer instantiation to subclasses",
		"motivation": "",
		"applicability": "",
		"structure": ""
	};
	beforeEach ->
		daoObj = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 10001
	it 'Can be instatiated with paraneters', (done) ->
		daoObj.should.have.property 'dbName', 'design_patterns'
		daoObj.should.have.property 'host', 'alex.mongohq.com'
		daoObj.should.have.property 'port', 10001
		daoObj.should.have.property 'db'
		should.exist daoObj.db
		daoObj.db.should.be.an.instanceof mongodb.Db
		done()
	it 'findAll returns my collection', (done) ->
		daoObj.findAll (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 2
			done()
	it "count returns my collection's number", (done) ->
		daoObj.count (err, count) ->
			should.strictEqual count, 2
			done()
	it "findById with id = 2 returns the Prototype pattern", (done) ->
		daoObj.findById 2, (err, item) ->
			item.should.have.property 'name', 'Prototype'
			done()
	it.only "insert new pattern (Factory Method) must the pattern", (done) ->
		daoObj.insert new_pattern, (err, item) ->
			doc = item[0]
			doc.should.have.property 'name', 'Factory Method'
			done()