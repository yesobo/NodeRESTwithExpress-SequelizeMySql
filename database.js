(function() {
  var Sequelize;

  Sequelize = require('sequelize');

  /*
  Database Connection
  */


  module.exports = function(options) {
    var database;
    database = {
      options: options
    };
    database.module = Sequelize;
    database.client = new Sequelize(options.schema, options.user, options.password, {
      host: options.host,
      port: options.port,
      logging: options.logging,
      dialect: 'mysql',
      maxConcurrentQueries: 100
    });
    /*
      @type {Object}
      Map all attributes of the registry
      (Instance method useful to every sequelize.Table)
      @this {SequelizeRegistry}
      @return {Object} All attributes in a Object
    */

    database.map = function() {
      var ctx, obj,
        _this = this;
      obj = {};
      ctx = this;
      ctx.attributes.forEach(function(attr) {
        return obj[attr] = ctx[attr];
      });
      return obj;
    };
    database.models = require('./models.js')(database.client);
    return database;
  };

}).call(this);
