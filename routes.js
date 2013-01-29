(function() {
  var DBConnector, util, winston;

  DBConnector = require("./daos/mongoHQDao.js");

  winston = require('winston');

  util = require('util');

  module.exports = function(app) {
    var daoObj;
    daoObj = new DBConnector('design_patterns', 'alex.mongohq.com', 10001);
    app.get('/api/patterns', function(req, res) {
      var limit;
      limit = req.query.limit;
      console.log('calling GET patterns with limit = ' + limit);
      return daoObj.findAll(limit, function(err, items) {
        return res.send(items);
      });
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
