// Generated by CoffeeScript 1.3.3
(function() {
  var MongoDBConnector, modules_url, should;

  modules_url = '../node_modules';

  MongoDBConnector = require("./dao.js");

  should = require("" + modules_url + "/should");

  describe('Tests for MongoDBConnector', function() {
    return it('Can be instatiated with paraneters', function(done) {
      var daoObj;
      daoObj = new MongoDBConnector('design_patterns', 'alex.mongohq.com', 100001);
      daoObj.should.have.property('dbName', 'design_patterns');
      daoObj.should.have.property('host', 'alex.mongohq.com');
      daoObj.should.have.property('port', 100001);
      return done();
    });
  });

}).call(this);
