module.exports = (app, db) ->
	Pattern_model = db.models.Pattern
	# Adds a pattern to the db
	addPattern = (pattern, cb) ->
		Pattern_model.count().success (c)->
			pattern.id = c + 1
			Pattern_model.create(pattern).success (pat) ->
				cb()

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
		intId = parseInt req.params.id, 10
		Pattern_model.find(intId).success (pattern) ->
			if pattern != null
				res.send(pattern) 
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
		addPattern new_pattern, (pattern) ->
				res.send new_pattern
		
	# PUT update pattern by id
	app.put '/api/patterns/:id', (req, res)->
		intId = parseInt req.params.id, 10
		Pattern_model.find(intId).success (pattern) ->
			pattern.name 					= req.body.name
			pattern.category	 		= req.body.category
			pattern.intent	 			= req.body.intent
			pattern.motivation	 	= req.body.motivation
			pattern.applicability	= req.body.applicability
			pattern.structure 		= req.body.structure
			
			pattern.save().success ->
				res.send 200

	# DELETE delete product by id
	app.del '/api/patterns/:id', (req, res)->
		intId = parseInt req.params.id, 10
		Pattern_model.find(intId).success (pattern)->
				if pattern != null
					pattern.destroy().success ->
						res.send 'pattern ' + pattern.id + ' deleted'
				else 
					res.send 404
