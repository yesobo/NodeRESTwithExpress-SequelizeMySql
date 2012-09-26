Sequelize = require 'sequelize'
###
Sequelize ORM Models
###
module.exports = (db) ->
	Pattern =  
		id: 
			type: Sequelize.INTEGER
			allowNul: false
			primaryKey: true
		name:
			type: Sequelize.STRING
			allowNull: false
			primaryKey: false
		category:
			type: Sequelize.STRING
			allowNull: false
		intent:
			type: Sequelize.TEXT
			allowNull: false
		motivation:
			type: Sequelize.TEXT
			allowNull: false
		applicability:
			type: Sequelize.TEXT
			allowNull: false
		structure: 
			type: Sequelize.TEXT
			allowNull: false

	db_options =
		timestamps: false
		freezeTableName: true
		instanceMethods: 
			mapAttributes: db.map
	###
	@type {Object}
	All models we have defined over Sequelize, plus the db instance itself
	###
	self =
		Pattern: db.define 'patterns', Pattern, db_options
	self