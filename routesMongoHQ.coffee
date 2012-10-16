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
	intId = parseInt req.param.id
	db.collection 'design_patterns', (err, collection) ->
		collection.findOne id:intId , (err, item)->
			res.send item

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
