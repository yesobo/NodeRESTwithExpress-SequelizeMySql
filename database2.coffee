Sequelize = require 'sequelize'

sequelize = new Sequelize 'design_patterns_test', 'root', '1234', {
	host: 'localhost'
	port: '3360'
	dialect: 'mysql'
}