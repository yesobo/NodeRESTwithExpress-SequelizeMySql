// Generated by CoffeeScript 1.3.3
(function() {
  var Pattern_model, addPattern;

  Pattern_model = db.models.Pattern;

  addPattern = function(pattern) {
    return Pattern_model.count().success(function(c) {
      pattern.id = c + 1;
      return Pattern_model.create(pattern).success(function(pat) {});
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
    intId = parseInt(req.params.id);
    return Pattern_model.find(intId).success(function(pattern) {
      return res.send(pattern);
    });
  });

  app.post('/api/patterns', function(req, res) {
    var newId, new_pattern;
    console.log("POST: ");
    console.log(req.body);
    newId = 0;
    new_pattern = {
      id: null,
      name: req.body.name,
      category: req.body.category,
      intent: req.body.intent,
      motivation: req.body.motivation,
      applicability: req.body.applicability,
      structure: req.body.structure
    };
    return addPattern(new_pattern);
  });

}).call(this);
