api_test_JSON = (url, type, data, callback) ->
	$.ajax(
		url: url
		type: type
		processData: false
		contentType: 'application/json; charset=utf-8'
		data: JSON.stringify data
		dataType: 'json'
		async: false
		complete: (result) ->
			if result.status == 0
				ok false, '0 status - browser could be on offline mode'
			else if result.status == 404
				ok false, '404 error'
			else
				callback $.parseJSON(result.responseText)
			
	)

api_test_GET = (url, callback) ->
	$.ajax(
		url: url
		async: false
		complete: (result) ->
			if result.status == 0
				ok false, '0 status - browser could be on offline mode'
			else if result.status == 404
				ok false, '404 error'
			else
				callback $.parseJSON(result.responseText)
			
	)

config =
	host: 'http://localhost'
	port: 8010
	apiRoot: '/api'

createUrl = (resource) ->
	config.host + ':' + config.port + config.apiRoot + resource


test "get all patterns synchronous", ->
	api_test_GET createUrl('/patterns'), (result) ->
		equal result.length, 2, 'there are 2 patterns'

asyncTest "get all patterns asynchronous", ->
	$.ajax {
		url: createUrl('/patterns')
		success: (data, textStatus, jsXHR) ->
			equal data.length, 2, "there are 2 patterns"
			notEqual data.length, 3, "there are not 3 patterns"		
	}
	setTimeout ( -> 
		start() ), 500

		