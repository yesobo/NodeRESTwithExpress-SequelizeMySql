DBConnector = require "./daos/mongoHQDao.js"
winston = require 'winston'
util = require 'util'

module.exports = (app) ->
	daoObj = new DBConnector 'design_patterns', 'alex.mongohq.com', 10001

	# GET all patterns
	app.get '/api/patterns', (req, res) ->
		limit = req.query.limit
		console.log 'calling GET patterns with limit = ' + limit
		daoObj.findAll limit, (err, items) ->			
			res.send items

	# POST a new pattern
	app.post '/api/patterns', (req, res) ->
		new_pattern = 
			name: req.body.name
			category: req.body.category
			intent: req.body.intent
			motivation: req.body.motivation
			applicability: req.body.applicability
			structure: req.body.structure
		daoObj.insert new_pattern, (err, docs) ->
			res.send 200

	# PUT a "patterns" JSON collection
	app.put '/api/patterns', (req, res) ->
		updated_patterns = 0
		patterns_length = req.body.patterns.length
		counter = 0

		updatePattern = (patt, cb) ->
			daoObj.update patt, (err, item) ->
				counter += 1
				if err == null
					updated_patterns += 1
				else
				if counter == patterns_length
					cb()

		updateCallback = () ->
			res.send {"updated_patterns": updated_patterns}
		
		updatePattern pat, updateCallback for pat in req.body.patterns				

	# GET the number of patterns
	app.get '/api/patterns/count', (req, res) ->
		daoObj.count (err, count) ->
			res.send {"number_of_patterns": count}

	# GET pattern by key(name)
	app.get '/api/patterns/:name', (req, res) ->
		pName = req.params.name
		daoObj.findByName pName, (err, item) ->
			if err != null
				winston.error "ERROR!"
				res.send err, item
			else
				if item != null
					res.send item
				else
					res.send 404

	# POST a new pattern
	app.post '/api/patterns/:name', (req, res) ->
		res.send 404

	# PUT update pattern by key (name)
	app.put '/api/patterns/:name', (req, res) ->
		pName = req.body.name
		updated_pattern =
			name: req.body.name
			category: req.body.category
			intent: req.body.intent
			motivation: req.body.motivation
			applicability: req.body.applicability
			structure: req.body.structure
		daoObj.update updated_pattern, (err) ->
			if err != null
				res.send 404
			else
				daoObj.findByName pName, (err, item) ->
					res.send item

	# DELETE delete product by id
	app.del '/api/patterns/:name', (req, res) ->
		pName = req.params.name
		daoObj.delete pName, (err) ->
			if err != null
				res.send 500
			else
				res.send 200

	# DELETE all patterns
	app.del '/api/patterns', (req, res) ->
		daoObj.count (err, count) ->
			daoObj.deleteAll (err) ->
				if err != null
					res.send err
				else
					res.send 200, "deleted_patterns": count

