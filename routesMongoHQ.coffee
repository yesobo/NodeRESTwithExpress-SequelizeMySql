# GET all patterns
app.get '/api/patterns/count', (req, res) ->
	console.log GLOBAL.db
	db.collection('design_patterns', (err, collection) ->
		collection.find().toArray (err, items)->
			res.send items
		)