(function() {

  module.exports = function(app, db) {
    var Pattern_model, addPattern;
    Pattern_model = db.models.Pattern;
    addPattern = function(pattern, cb) {
      return Pattern_model.count().success(function(c) {
        pattern.id = c + 1;
        return Pattern_model.create(pattern).success(function(pat) {
          return cb();
        });
      });
    };
    app.get('/api/patterns', function(req, res) {
      return Pattern_model.findAll().success(function(patterns) {
        return res.send(patterns);
      });
    });
    app.get('/api/patterns/count', function(req, res) {
      return Pattern_model.count().success(function(c) {
        return res.send(c.toString());
      });
    });
    app.get('/api/patterns/:id', function(req, res) {
      var intId;
      intId = parseInt(req.params.id, 10);
      return Pattern_model.find(intId).success(function(pattern) {
        if (pattern !== null) {
          return res.send(pattern);
        } else {
          return res.send(404);
        }
      });
    });
    app.post('/api/patterns', function(req, res) {
      var new_pattern;
      new_pattern = {
        id: null,
        name: req.body.name,
        category: req.body.category,
        intent: req.body.intent,
        motivation: req.body.motivation,
        applicability: req.body.applicability,
        structure: req.body.structure
      };
      return addPattern(new_pattern, function(pattern) {
        return res.send(new_pattern);
      });
    });
    app.put('/api/patterns/:id', function(req, res) {
      var intId;
      intId = parseInt(req.params.id, 10);
      return Pattern_model.find(intId).success(function(pattern) {
        pattern.name = req.body.name;
        pattern.category = req.body.category;
        pattern.intent = req.body.intent;
        pattern.motivation = req.body.motivation;
        pattern.applicability = req.body.applicability;
        pattern.structure = req.body.structure;
        return pattern.save().success(function() {
          return res.send(200);
        });
      });
    });
    return app.del('/api/patterns/:id', function(req, res) {
      var intId;
      intId = parseInt(req.params.id, 10);
      return Pattern_model.find(intId).success(function(pattern) {
        if (pattern !== null) {
          return pattern.destroy().success(function() {
            return res.send('pattern ' + pattern.id + ' deleted');
          });
        } else {
          return res.send(404);
        }
      });
    });
  };

}).call(this);
