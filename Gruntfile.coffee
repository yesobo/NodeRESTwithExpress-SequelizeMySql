module.exports = (grunt) ->
    
    grunt.initConfig
        jshint:
            options:
                curly: true
                eqeqeq: true
                immed: true
                latedef: true
                newcap: true
                noarg: true
                sub: true
                undef: true
                eqnull: true
                browser: true
                predef:
                    ['require']

                
            myproject:
                src: ['app.js']
    
    grunt.loadNpmTasks 'grunt-contrib-jshint'

    grunt.registerTask 'default', ['jshint:myproject']

