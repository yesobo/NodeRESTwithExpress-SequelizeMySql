modules_url = '../node_modules'

MongoDBConnector = require "./dao.js"

mongodb = require 'mongodb'
should = require "#{modules_url}/should"

describe 'Tests for MongoDBConnector', ->
	daoObj = null
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
	it "findById with id = 2 returns the Prototype pattern"
		daoObj.findById (err, item) ->
			item.name.should.be.equals "Prototype"
			done()