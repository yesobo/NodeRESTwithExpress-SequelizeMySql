modules_path = '/node_modules'
source_path = '../..'

MongoDBConnector = require "#{source_path}/daos/mongoHQDao.js"
test_patterns = require '../test_patterns.js'

mongodb = require 'mongodb'
should = require "#{source_path}#{modules_path}/should"

winston = require "winston"

describe 'Tests for MongoDBConnector', ->
	daoObj = null
	in_db_patterns_names = {
		"Singleton" : "Singleton",
		"Prototype" : "Prototype"
	}

	test_pattern1 = test_patterns.singleton
	test_pattern2 = test_patterns.prototype_pattern

	new_pattern = test_patterns.factory_method

	before (done) ->
		daoObj = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 10001
		winston.log "deleting collection..."
		daoObj.deleteAll (err) ->
			winston.error "ERROR DELETING DB: #{err}" if err?
			winston.info "collection deleted."
			winston.info "inserting pattern1"
			daoObj.insert test_pattern1, (err, docs) ->
				winston.error "ERROR INSERTING PATTERN1: #{err}" if err?
				winston.info "pattern1 inserted"
				winston.info "inserting pattern2"
				daoObj.insert test_pattern2, (err, docs) ->
					winston.error "ERROR INSERTING PATTERN1: #{err}" if err?
					winston.info "pattern2 inserted"
					winston.info "DB restarted"
					done()
	beforeEach ->
		daoObj = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 10001
		null

	it 'Can be instatiated with paraneters', (done) ->
		daoObj.should.have.property 'dbName', 'design_patterns'
		daoObj.should.have.property 'host', 'alex.mongohq.com'
		daoObj.should.have.property 'port', 10001
		daoObj.should.have.property 'db'
		should.exist daoObj.db
		daoObj.db.should.be.an.instanceof mongodb.Db
		done()
	it 'findAll with empty parameters returns the whole collection', (done) ->
		daoObj.findAll {}, {}, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 2
			done()
	it 'findAll({}, {limit:1}, callback) returns our first element', (done) ->
		daoObj.findAll {}, limit:1, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern1.name
			done()
	it 'findAll({}, {offset:1}, callback) returns the second element', (done) ->
		daoObj.findAll {}, offset:1, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern2.name
			done()
	pageOptions =
		limit: 1
		offset: 1
	it 'findAll({limit:1, offset:1}, callback) returns the second element', (done) ->
		daoObj.findAll {}, pageOptions, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern2.name
			done()
	it "findAll with queryOptions = {name:#{test_pattern1.name}} returns our first test element", (done) ->
		queryOptions =
			name: test_pattern1.name
		daoObj.findAll queryOptions, {}, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern1.name
			done()
	it "findAll with queryOptions = {name:#{test_pattern2.name}} returns our second test element", (done) ->
		queryOptions =
			name: test_pattern2.name
		daoObj.findAll queryOptions, {}, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern2.name
			done()
	it "findAll with queryOptions = {category: #{test_pattern1.category}} returns both test patterns", (done) ->
		queryOptions =
			category: test_pattern1.category
		daoObj.findAll queryOptions, {}, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 2
			done()
	it "findAll with queryOptions = {category: #{test_pattern1.category}, name: #{test_pattern2.name}} returns our second test element", (done) ->
		queryOptions =
			category: test_pattern1.category
			name: test_pattern2.name
		daoObj.findAll queryOptions, {}, (err, items) ->
			items.should.be.an.instanceOf Array
			items.should.have.length 1
			items[0].should.have.property 'name', test_pattern2.name
			done()
	it "findAll with queryOptions = {category: #{test_pattern1.category}, name: 'noPattern'} returns 404 error and {'message', 'document not founr'}", (done) ->
		queryOptions =
			category: test_pattern1.category
			name: 'noPattern'
		daoObj.findAll queryOptions, {}, (err, items) ->
			should.strictEqual err, 404
			items.should.have.property 'message', 'no documents found'
			done()
	it "findAll with queryOptions = {noExistsField: ''} returns 404 error and {'message', 'document not founr'}", (done) ->
		queryOptions =
			noExistsField: ''
		daoObj.findAll queryOptions, {}, (err, items) ->
			should.strictEqual err, 404
			items.should.have.property 'message', 'no documents found'
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
				daoObj.findAll {}, {}, (err, items) ->
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