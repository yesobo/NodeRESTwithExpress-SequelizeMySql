DBConnector = require "./daos/mongoHQDao.js"
daoObj = new DBConnector 'design_patterns', 'alex.mongohq.com', 10001

# GET all patterns
app.get '/api/patterns', (req, res) ->
	daoObj.findAll (err, items) ->			
		res.send items

# GET the number of patterns
app.get '/api/patterns/count', (req, res) ->
	daoObj.count (err, count) ->
		res.send count.toString()

# GET pattern by id
app.get '/api/patterns/:id', (req, res) ->
	intId = parseInt req.params.id
	daoObj.findById intId, (err, item) ->
		console.log "result: #{item}"
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
		id: req.body.id
		name: req.body.name
		category: req.body.category
		intent: req.body.intent
		motivation: req.body.motivation
		applicability: req.body.applicability
		structure: req.body.structure
	daoObj.insert new_pattern, (err, docs) ->
		res.send 200

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
	daoObj.update updated_pattern, (err) ->
		if err? 
			res.send 404
		else
			daoObj.findById intId, (err, item) ->
				res.send item

# DELETE delete product by id
app.del '/api/patterns/:id', (req, res) ->
	intId = parseInt req.params.id
	daoObj.delete intId, (err) ->
		if err?
			res.send 500
		else
			res.send 200
