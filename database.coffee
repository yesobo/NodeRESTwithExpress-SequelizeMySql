Sequelize = require 'sequelize'
###
Database Connection
###
module.exports = (options) ->
	database =
		options: options
	database.module = Sequelize
	database.client = new Sequelize options.schema,
    options.user,
    options.password, 
    	{
    		host:options.host
    		port: options.port
    		logging: options.logging
    		dialect: 'mysql'
    		maxConcurrentQueries: 100
    	}
  ###
  @type {Object}
  Map all attributes of the registry
  (Instance method useful to every sequelize.Table)
  @this {SequelizeRegistry}
  @return {Object} All attributes in a Object
  ###
  database.map = ->
  	obj = {}
  	ctx = this
  	ctx.attributes.forEach (attr)=> obj[attr] = ctx[attr]
  	obj
  database.models = require('./models.js')(database.client)
  database
