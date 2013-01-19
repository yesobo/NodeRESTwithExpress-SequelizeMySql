module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		lint:
			all: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
		jshint:
			option:
				browser: true

	# Load the plugin that provides the uglify task
	# grunt.loadNpmTasks 'grunt-sample'

	# Default task(s)
	grunt.registerTask 'default', ['lint']