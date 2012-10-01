Pattern_model = db.models.Pattern

# Adds a pattern to the db
addPattern = (pattern) ->
	Pattern_model.count().success (c)->
		pattern.id = c + 1
		Pattern_model.create(pattern).success (pat) ->

# GET all patterns
app.get '/api/patterns', (req, res) ->
	Pattern_model.findAll().success (patterns) ->
		res.send patterns

# GET the number of patterns
app.get '/api/patterns/count', (req, res) ->
	Pattern_model.count().success (c) ->
		res.send c.toString()

# GET pattern by id
app.get '/api/patterns/:id', (req, res) ->
	intId = parseInt(req.params.id)
	Pattern_model.find(intId).success (pattern) ->
		res.send pattern

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
	addPattern(new_pattern)
	res.send new_pattern

# PUT update pattern by id
app.put '/api/patterns/:id', (req, res)->
	intId = parseInt req.params.id
	Pattern_model.find(intId).success (pattern) ->
		pattern.name 					= req.body.name
		pattern.category	 		= req.body.category
		pattern.intent	 			= req.body.intent
		pattern.motivation	 	= req.body.motivation
		pattern.applicability	= req.body.applicability
		pattern.structure 		= req.body.structure
		
		pattern.save().success ->

# DELETE delete product by id
app.del '/api/patterns/:id', (req, res)->
	console.log 'MAKING DELETION----------------'
	intId = parseInt req.params.id
	Pattern_model.find(intId).success (pattern)->
			console.log 'find of delete operation is sucess'
			console.log 'and the pattern to find is ' + pattern
			if pattern?
				pattern.destroy().success ->
					res.send 'pattern ' + pattern.id + ' deleted'
			else 
				console.log 'PATTERN NOT DELETED'
				res.send 404
