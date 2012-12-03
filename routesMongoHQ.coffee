# Adds a pattern to the db
addPattern = (pattern, cb) ->
	db.collection 'design_patterns', (err, collection) ->
		collection.count (err, count) ->
			pattern.id = count + 1
			collection.insert pattern, (err, doc) ->
				cb()

# GET all patterns
app.get '/api/patterns', (req, res) ->
	db.collection 'design_patterns', (err, collection) ->
		collection.find().toArray (err, items)->
			res.send items

# GET the number of patterns
app.get '/api/patterns/count', (req, res) ->
	db.collection('design_patterns', (err, collection) ->
		collection.count (err, count)->
			res.send count.toString()
		)

# GET pattern by id
app.get '/api/patterns/:id', (req, res) ->
	intId = parseInt req.params.id
	db.collection 'design_patterns', (err, collection) ->
		collection.findOne id:intId , (err, item)->
			if err?
				res.send 500	
			else
				if item?
					res.send item
				else
					res.send 404

# POST a new pattern
app.post '/api/patterns', (req, res) ->
	new_pattern = 
		id: null # generated automattically
		name: req.body.name
		category: req.body.category
		intent: req.body.intent
		motivation: req.body.motivation
		applicability: req.body.applicability
		structure: req.body.structure
	addPattern new_pattern, () ->
		res.send new_pattern

# PUT upgrade pattern by id
app.put '/api/patterns/:id', (req, res) ->
	intId = parseInt req.params.id
	updated_pattern =
		name: req.body.name
		category: req.body.category
		intent: req.body.intent
		motivation: req.body.motivation
		applicability: req.body.applicability
		structure: req.body.structure
	db.collection 'design_patterns', (err, collection) ->
		collection.update id:intId, 
			$set: 
				name: updated_pattern.name
				category: updated_pattern.category
				intent: updated_pattern.intent
				motivation: updated_pattern.motivation
				applicability: updated_pattern.applicability
				structure: updated_pattern.structure,
			(err) ->
				if err? 
					res.send 404
				else
					res.send updated_pattern

# DELETE delete product by id
app.del '/api/patterns/:id', (req, res) ->
	intId = parseInt req.params.id
	db.collection 'design_patterns', (err, collection) ->
		collection.remove id:intId, (err, removed) ->
			if err?
				res.send 500
			else
				res.send removed
