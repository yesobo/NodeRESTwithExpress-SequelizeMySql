(function() {
  var allowCrossDomain, app, args, database_options, express, port, routes, routesPath,
    _this = this;

  express = require('express');

  app = express();

  routesPath = "./routes.js";

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

  allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
  };

  app.configure(function() {
    app.set('views', __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
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

  routes = require(routesPath)(app);

  app.listen(port);

  console.log("Express Server listening on port " + port + " in " + app.settings.env + " mode.");

}).call(this);
