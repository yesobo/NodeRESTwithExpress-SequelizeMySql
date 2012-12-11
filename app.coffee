# Module dependencies
express = require 'express'
# Create Application Server
app = express()
# Set dao init path
#database = "./database.js"
routes = "./routesMongoHQ.js"

###
app
@type {Express}
The Singleton of Express app instance
###
GLOBAL.app = app

###
Retrieve Commanbd Line Arguments
[0] process = String 'node'
[1] app : void
[2] port : Number 8010
###
args = process.argv

###
port
@type {Number}
HTTP Server Port
###
port = if args[2] then args[2] else 8010

# Database Connections
database_options = 
	schema: "design_patterns_test"
	user: "root"
	password: "1234"
	host: "localhost"
	port: "3306"

# CORS middleware
allowCrossDomain = (req, res, next) ->
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()


# Configuration
app.configure =>
	app.set 'views', __dirname + "/views"
	app.set 'view engine', 'jade'
	app.use	express.bodyParser()
	app.use express.methodOverride()
	app.use allowCrossDomain
	app.use express.cookieParser()
	app.use express.static(__dirname + "/public")
	#app.use "/test", express.static(__dirname + "/public/test")

app.configure 'development', ->
	app.use express.errorHandler(
		dumpExceptions: true
		showStach: true
			)
	database_options.logging = true

app.configure 'production', ->
	app.use express.errorHandler()
	database_options.logging = false

app.get '/api', (req, res)=>
	res.send 'Ecomm API is running'

# Routes
routes = require routes
# HTTP Server
app.listen port
console.log "Express Server listening on port #{port} in #{app.settings.env} mode using Sequelize ORM."