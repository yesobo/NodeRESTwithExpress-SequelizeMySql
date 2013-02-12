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
                    ['require',
                     'module',
                     'process',
                     '__dirname',
                     'console',
                     'describe',
                     'before',
                     'beforeEach',
                     'it']

            myproject:
                src: ['app.js',
                      'database.js',
                      'models.js',
                      'routes.js',
                      'rouesSequelize.js',
                      'daos/*.js',
                      'test/**/*.js']
        simplemocha:
            options:
                #globals: ['should']
                timeout: 10000
                #ignoreLeaks: false
                #grep: '*-test'
                ui: 'bdd'
                #reporters: 'tap'

            all:
                src: [
                    'test/mocha_api_test.js', 
                    'test/daos/mongoHQDao_test.js']

        coffee:
            compile:
                files:
                    grunt.file.expandMapping(['*.coffee', 'daos/*.coffee', 'test/daos/*.grunt-contrib-coffee'], '', rename: (destBase, destPath) -> destBase + destPath.replace('.coffee', '.js'))

        watch:
            coffee:
                files: ['**/**/*.coffee'],
                tasks: 'coffee'

    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-simple-mocha'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'default', ['coffee', 'jshint:myproject', 'simplemocha']

