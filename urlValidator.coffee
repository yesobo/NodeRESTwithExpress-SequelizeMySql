winston = require 'winston'

module.exports = class UrlValidator
	# req: request object
	constructor: (@findOptions, @pageOptions) ->

	isValidRequest: (request) ->
		usedOptionsObj = request.query
		allowedOptions = @findOptions.concat @pageOptions
		errorFound = false
		i = 0
		# checking used options against allowedOptions
		for key, value of usedOptionsObj
			errorFound = not (key in allowedOptions)
			i += 1
		return !errorFound
		