#npm install mongodb
mongodb = require 'mongodb'
winston = require 'winston'
util = require 'util'


#Use:
#	connector = new MongoDBConnector 'design_patterns', 'alex.mongohq.com', 100001
#	connector.findAll (err, items) -> res.send items

module.exports = class MongoDBConnector
	# dbName = 'design_patterns'
	# host = 'alex.mongohq.com'
	# port = 10001
	constructor: (@dbName, @host, @port) ->
		@db = new mongodb.Db(@dbName, new mongodb.Server(@host, @port, {auto_reconnect:true}), {safe:true})

	#call: callback parameters are (err, collection)
	initTransaction = (callback) ->
		if @db._state == 'connected'
			winston.info "Conection opened"
			@db.collection @dbName, callback
		else
			winston.info "opening connection..."
			privateDb = @db
			privateDBName = @dbName
			@db.open (err, p_client) ->
				if err?
					winston.error "ERROR opening connection: #{err}"
				else	
					winston.info "connection opened"
					winston.info "authenticating..."
					privateDb.authenticate 'admin', '1234', (err) ->
						winston.info "autenticated!"
						privateDb.collection privateDBName, callback

	#call: callback parameters are (err, items)
	findAll: (callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR!"
				callback err, null
			else
				collection.find().toArray (err, items) ->
					callback err, items

	#call: callback parameters are (err, count)
	count: (callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR"
				callback err, null
			else
				collection.count (err, count) ->
					callback err, count

	#call: callback parameters are (err, item)
	findByName: (name, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR!"
				callback err, null
			else
				collection.findOne name:name, (err, item) ->
					if item == null
						err = 404
						item = {"message": "document not found"}	
					callback err, item

	#call: callback parameters are (err, doc)
	insert: (pattern, callback) ->
		if pattern.name == null or pattern.name == ""
			err = 400
			item = {'message': 'You must insert an id value'}
			callback err, item
		else
			initTransaction.call this, (err, collection) ->
				if err?
					winston.error "ERROR!"
					callback err, null
				else
					collection.findOne name:pattern.name, (err, item) ->
						if item?
							err = 400
							item = {"message": "A document already exists with that id"}	
							callback err, item
						else
							collection.insert pattern, (err, doc) ->
								callback err, doc


	#call: callback parameters are (err, item)
	update: (pattern, callback) ->
		name = pattern.name
		new_cat = pattern.category
		new_intent = pattern.intent
		new_motiv = pattern.motivation
		new_appli = pattern.applicability
		new_struc = pattern.structure
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR!"
				callback err, null
			else
				collection.findOne name:name, (err, item) ->
					if item?
						collection.update name:name,
							$set:
								category: new_cat
								intent: new_intent
								motivation: new_motiv
								applicability: new_appli
								structure: new_struc,
							(err, item) ->
								callback err, item
					else
						err = 404
						item = {"message": "document not found"}
						callback err, item

	#call: callback parameters are (err, item)
	delete: (pName, callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR!"
				callback err, "DB error"
			else
				collection.findOne name:pName, (err, item) ->
					if item?
						collection.remove name:pName, (err) ->
							callback err, {"message": "item removed"}
					else
						err = 404
						item = {"message": "document not found"}
						callback err, item

	#call: callback parameters are (err)
	deleteAll: (callback) ->
		initTransaction.call this, (err, collection) ->
			if err?
				winston.error "ERROR!"
				callback err
			else
				collection.remove {}, (err) ->
					callback err