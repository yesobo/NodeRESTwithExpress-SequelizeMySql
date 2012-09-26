// Generated by CoffeeScript 1.3.3
(function() {
  var app, args, database, database_options, express, port, routes,
    _this = this;

  express = require('express');

  app = express();

  routes = "./routes.js";

  database = "./database.js";

  /*
  app
  @type {Express}
  The Singleton of Express app instance
  */


  GLOBAL.app = app;

  /*
  Retrieve Commanbd Line Arguments
  [0] process = String 'node'
  [1] app : void
  [2] port : Number 8010
  */


  args = process.argv;

  /*
  port
  @type {Number}
  HTTP Server Port
  */


  port = args[2] ? args[2] : 8010;

  database_options = {
    schema: "design_patterns_test",
    user: "root",
    password: "1234",
    host: "localhost",
    port: "3306"
  };

  app.configure(function() {
    app.set('views', __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    return app.use(express["static"](__dirname + "/public"));
  });

  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStach: true
    }));
    return database_options.logging = true;
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
    return database_options.logging = false;
  });

  app.get('/api', function(req, res) {
    return res.send('Ecomm API is running');
  });

  /*
  db (database)
  @type {Object}
  @param Object [database_options] the database options
  */


  GLOBAL.db = require(database)(database_options);

  routes = require(routes);

  app.listen(port);

  console.log("Express Server listening on port " + port + " in " + app.settings.env + " mode using Sequelize ORM.");

}).call(this);
