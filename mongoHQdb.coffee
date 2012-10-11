# npm install mongodb
mongodb = require 'mongodb'
url = require 'url'
log = console.log

connection_uri = "mongodb://admin:1234@alex.mongohq.com:10001/design_patterns"
db_name = connection_uri.pathname.replace(/^\//, '')

mongodb.Db.connect process.env.MONGOHQ_URL, (error, client) ->
	throw error if error

	client.collectionNames (error, names)->
		throw error if error

		# output all collection names
		log "Collections"
		log "==========="
		last_collection = null
		for col_data in names
			col_name = col_data.name.replace("#{db_name}.", '')
			log col_name
			last_collection = col_name

		collection = new mongodb.Collection(client, last_collection)
		log "\nDocuments in #{last_collection}"
		documents = collection.find({}, limit : 5)

		# output a count of all documents found
		documents.count (error, count) ->
			log " #{count} document(s) found"
			log "==========================="

			# output the first 5 documents
			documents.toArray (error, docs) ->
				throw error if error

				for doc in docs then log doc

				# close the connection
				client.close()