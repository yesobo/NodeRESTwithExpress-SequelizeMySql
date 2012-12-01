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

	#call: callback parameters are (err, collection)
	initTransaction = (callback) ->
		if @db._state == 'connected'
			console.log "Conection opened"
			@db.collection @dbName, callback
		else
			console.log "opening connection..."
			privateDb = @db
			privateDBName = @dbName
			@db.open (err, p_client) ->
				if err?
					console.log "ERROR opening connection: #{err}"
				else	
					console.log "connection opened"
					console.log "authenticating..."
					privateDb.authenticate 'admin', '1234', (err) ->
						console.log "autenticated!"
						privateDb.collection privateDBName, callback

	#call: callback parameters are (err, items)
	findAll: (callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR!"
				callback err, null
			else
				collection.find().toArray (err, items) ->
					callback err, items

	#call: callback parameters are (err, count)
	count: (callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR"
				callback err, null
			else
				collection.count (err, count) ->
					callback err, count

	#call: callback parameters are (err, item)
	findById: (pId, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR!"
				callback err, null
			else
				collection.findOne id:pId, (err, item) ->
					callback err, item

	#call: callback parameters are (err, doc)
	insert: (pattern, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR!"
				callback err, null
			else
				collection.insert pattern, (err, doc) ->
					callback err, doc

	#call: callback parameters are (err)
	update: (pattern, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR!"
				callback err, null
			else
				collection.update id:pattern.id,
					$set:
						name: pattern.name
						category: pattern.category
						intent: pattern.intent
						motivation: pattern.motivation
						applicability: pattern.applicability
						structure: pattern.structure,
					(err) ->
						callback err

	#call: callback parameters are (err)
	delete: (pId, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				console.log "ERROR!"
			else	
				collection.remove id:pId, (err) ->
					callback err