# npm install mongodb
mongodb = require 'mongodb'
url = require 'url'
log = console.log
###
Database Connection
###
module.exports = () ->
	log 'connecting to database...'
	#connection_uri = "mongodb://admin:1234@alex.mongohq.com:10001/design_patterns"
	db = new mongodb.Db('design_patterns', new mongodb.Server('alex.mongohq.com', 10001, {auto_reconnect:true}), {});
	db.open (err, p_client) ->
  		#Notice the USERNAME and PASSWORD!
  		db.authenticate 'admin', '1234', (err) ->
   			#Change error handler when going into production
   			log 'authenticated!'
	db	
###
	dbOp =
		success: (callback) =>
			log 'waiting for result...'
			while @result != null then
			eval callback(@result)
		result: null

	findAll = ->
		log 'executing findAll'
		db.collection 'design_patterns', (err, collection) ->
			log err if err
			log 'executing find documents'
			collection.find().toArray (err, items) ->
				throw error if err
				log 'items is #{items}'
				dbOp.result = items
		dbOp

	log 'calling findAll'
	findAll().success (patterns) ->
		log patterns
		log 'PATTERNS'
		log '========'
		for p in patterns
			log p.id
			log p.name
			log p.intent


db.connect connection_uri, (error, client) ->
	throw error if error
	log "Connected to design_patterns database"


Pattern_model.findAll().success (patterns) ->
		res.send patterns

dbOp =
	success: (callback) =>
		eval callback(this.result)

findAll = ->
	db.collection 'design_patterns', (err, collection) ->
		collection.find().toArray (err, items) ->
			dbOp.result = items
	deOp

log 'calling findAll'
findAll().success (patterns) ->
	log 'PATTERNS'
	log '========'
	for p in patterns
		log p.id
		log p.name
		log p.intent
 
create(pattern).success (pat) ->
.count().success (c) ->
.find(intId).success (pattern) ->
pattern.save().success ->
pattern.destroy().success ->
###