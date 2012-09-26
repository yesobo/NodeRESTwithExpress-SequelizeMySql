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
	console.log "POST: "
	console.log req.body	
	newId = 0;
	new_pattern = 
		id: null # generated automattically
		name: req.body.name
		category: req.body.category
		intent: req.body.intent
		motivation: req.body.motivation
		applicability: req.body.applicability
		structure: req.body.structure
	addPattern new_pattern
