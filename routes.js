(function() {
  var DBConnector, UrlValidator, util, winston;

  DBConnector = require("./daos/mongoHQDao.js");

  winston = require('winston');

  util = require('util');

  UrlValidator = require('./urlValidator.js');

  module.exports = function(app) {
    var daoObj, urlValidator;
    daoObj = new DBConnector('design_patterns', 'alex.mongohq.com', 10001);
    urlValidator = new UrlValidator(["name", "category"], ["limit", "offset"]);
    app.get('/api/patterns', function(req, res) {
      var findOptions, pageOptions, validation_error;
      winston.info("validating query");
      if (urlValidator.isValidRequest(req)) {
        validation_error = {
          code: '',
          message: ''
        };
        findOptions = {};
        if (req.query.name != null) {
          findOptions.name = req.query.name;
        }
        if (req.query.category != null) {
          findOptions.category = req.query.category;
        }
        pageOptions = {};
        if ((req.query.limit != null) && req.query.limit !== 'undefined') {
          pageOptions.limit = req.query.limit;
          winston.info("limit value is: " + pageOptions.limit);
          if (pageOptions.limit !== "") {
            if (isNaN(pageOptions.limit)) {
              validation_error.code = 404;
              validation_error.message = "'" + pageOptions.limit + "' is not a valid limit value";
            }
          }
        }
        if ((req.query.offset != null) && typeof req.query.offset !== 'undefined') {
          pageOptions.offset = req.query.offset;
          winston.info("offset value is: " + pageOptions.offset);
          if (pageOptions.offset !== "") {
            if (isNaN(pageOptions.offset)) {
              winston.info("offset isNaN");
              validation_error.code = 404;
              validation_error.message = "'" + pageOptions.offset + "' is not a valid offset value";
            }
          }
        }
        if (validation_error.code === '') {
          winston.info("searching...");
          return daoObj.findAll(findOptions, pageOptions, function(err, items) {
            winston.info("err: " + err + ", items: " + items);
            if (err === null) {
              winston.info("sending items");
              return res.send(items);
            } else {
              return res.send(404, {
                "message": "no documents found"
              });
            }
          });
        } else {
          return res.send(validation_error.code, {
            "message": validation_error.message
          });
        }
      } else {
        return res.send(400, {
          "message": "unsupported query parameter"
        });
      }
    });
    app.post('/api/patterns', function(req, res) {
      var new_pattern;
      new_pattern = {
        name: req.body.name,
        category: req.body.category,
        intent: req.body.intent,
        motivation: req.body.motivation,
        applicability: req.body.applicability,
        structure: req.body.structure
      };
      return daoObj.insert(new_pattern, function(err, docs) {
        return res.send(200);
      });
    });
    app.put('/api/patterns', function(req, res) {
      var counter, pat, patterns_length, updateCallback, updatePattern, updated_patterns, _i, _len, _ref, _results;
      updated_patterns = 0;
      patterns_length = req.body.patterns.length;
      counter = 0;
      updatePattern = function(patt, cb) {
        return daoObj.update(patt, function(err, item) {
          counter += 1;
          if (err === null) {
            updated_patterns += 1;
          } else {

          }
          if (counter === patterns_length) {
            return cb();
          }
        });
      };
      updateCallback = function() {
        return res.send({
          "updated_patterns": updated_patterns
        });
      };
      _ref = req.body.patterns;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pat = _ref[_i];
        _results.push(updatePattern(pat, updateCallback));
      }
      return _results;
    });
    app.get('/api/patterns/count', function(req, res) {
      return daoObj.count(function(err, count) {
        return res.send({
          "number_of_patterns": count
        });
      });
    });
    app.get('/api/patterns/:name', function(req, res) {
      var pName;
      pName = req.params.name;
      return daoObj.findByName(pName, function(err, item) {
        if (err !== null) {
          winston.error("ERROR!");
          return res.send(err, item);
        } else {
          if (item !== null) {
            return res.send(item);
          } else {
            return res.send(404);
          }
        }
      });
    });
    app.post('/api/patterns/:name', function(req, res) {
      return res.send(404);
    });
    app.put('/api/patterns/:name', function(req, res) {
      var pName, updated_pattern;
      pName = req.body.name;
      updated_pattern = {
        name: req.body.name,
        category: req.body.category,
        intent: req.body.intent,
        motivation: req.body.motivation,
        applicability: req.body.applicability,
        structure: req.body.structure
      };
      return daoObj.update(updated_pattern, function(err) {
        if (err !== null) {
          return res.send(404);
        } else {
          return daoObj.findByName(pName, function(err, item) {
            return res.send(item);
          });
        }
      });
    });
    app.del('/api/patterns/:name', function(req, res) {
      var pName;
      pName = req.params.name;
      return daoObj["delete"](pName, function(err) {
        if (err !== null) {
          return res.send(500);
        } else {
          return res.send(200);
        }
      });
    });
    return app.del('/api/patterns', function(req, res) {
      return daoObj.count(function(err, count) {
        return daoObj.deleteAll(function(err) {
          if (err !== null) {
            return res.send(err);
          } else {
            return res.send(200, {
              "deleted_patterns": count
            });
          }
        });
      });
    });
  };

}).call(this);
