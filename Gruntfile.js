(function() {

  module.exports = function(grunt) {
    grunt.initConfig({
      jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          eqnull: true,
          browser: true,
          predef: ['require', 'module', 'process', '__dirname', 'console', 'describe', 'before', 'beforeEach', 'it']
        },
        myproject: {
          src: ['*.js', 'daos/*.js', 'test/**/*.js']
        }
      },
      simplemocha: {
        options: {
          timeout: 10000,
          ui: 'bdd'
        },
        all: {
          src: ['test/mocha_api_test.js', 'test/daos/mongoHQDao_test.js']
        }
      },
      coffee: {
        compile: {
          files: grunt.file.expandMapping(['*.coffee', 'daos/*.coffee'], '', {
            rename: function(destBase, destPath) {
              return destBase + destPath.replace('.coffee', '.js');
            }
          })
        }
      },
      watch: {
        coffee: {
          files: ['**/**/*.coffee'],
          tasks: 'coffee'
        }
      }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    return grunt.registerTask('default', ['coffee', 'jshint:myproject', 'simplemocha']);
  };

}).call(this);
