#npm install mongodb
mongodb = require 'mongodb'

###
Use:
	connector = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 100001
	connector.findAll (err, items) -> res.send items
###
module.exports = class MongoDBConnector
	# dbName = 'design_patterns'
	# host = 'alex.mongohq.com'
	# port = 10001
	constructor: (@dbName, @host, @port) ->
		@db = new mongodb.Db(@dbName, new mongodb.Server(@host, @port, {auto_reconnect:true}), {});
		privateDb = @db
		@db.open (err, p_client) ->
			privateDb.authenticate 'admin', '1234', (err) ->
				console.log 'autenticated!'

	#call: callback parameters are (err, collection)
	initTransaction = (callback) ->
		@db.collection @dbName, callback


	#call: callback parameters are (err, items)
	findAll: (callback) ->
		initTransaction.call this, (err, collection) ->
			console.log 'calling find()...'
			collection.find().toArray (err, items) ->
				callback err, items

	#call: callback parameters are (err, count)
	count: (callback) ->
		initTransaction (err, collection) ->
			collection.count (err, count) ->
				callback err, count

	#call: callback parameters are (err, item)
	findById: (pId, callback) ->
		initTransaction (err, collection) ->
			collection.findOne id:pId, (err, item) ->
				callback err, item

	#call: callback parameters are (err, doc)
	insert: (pattern, callback) ->
		initTransaction (err, collection) ->
			collection.count (err, count) ->
				pattern.id = count + 1
				collection.insert pattern, (err, doc) ->
					callback err, doc

	#call: callback parameters are (err, pattern)
	update: (pattern, callback) ->
		initTransaction (err, collection) ->
			collection.update id:pattern.id,
				$set:
					name: pattern.name
					category: pattern.category
					intent: pattern.intent
					motivation: pattern.motivation
					applicability: pattern.applicability
					structure: pattern.structure,
				(err) ->
					callback err, pattern

	#call: callback parameters are (err, removed)
	delete: (pId, callback) ->
		initTransaction (err, collection) ->
			collection.remove id:pId, (err, removed) ->
				callback err, removed