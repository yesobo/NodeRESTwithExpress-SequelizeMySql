// Generated by CoffeeScript 1.3.3
(function() {
  var MongoDBConnector, modules_path, mongodb, should, source_path, test_patterns;

  modules_path = '/node_modules';

  source_path = '../..';

  MongoDBConnector = require("" + source_path + "/daos/mongoHQDao.js");

  test_patterns = require('../test_patterns.js');

  mongodb = require('mongodb');

  should = require("" + source_path + modules_path + "/should");

  describe('Tests for MongoDBConnector', function() {
    var daoObj, in_db_patterns_names, new_pattern, test_pattern1, test_pattern2;
    daoObj = null;
    in_db_patterns_names = {
      "Singleton": "Singleton",
      "Prototype": "Prototype"
    };
    test_pattern1 = test_pattens.singleton;
    test_pattern2 = test_patterns.prototype_pattern;
    new_pattern = test_patterns.factory_method;
    before(function(done) {
      daoObj = new MongoDBConnector('design_patterns', 'alex.mongohq.com', 10001);
      console.log("deleting collection...");
      return daoObj.deleteAll(function(err) {
        console.log("collection deleted.");
        console.log("inserting pattern1");
        return daoObj.insert(test_pattern1, function(err, docs) {
          console.log("pattern1 inserted");
          console.log("inserting pattern2");
          return daoObj.insert(test_pattern2, function(err, docs) {
            console.log("DB restarted");
            return done();
          });
        });
      });
    });
    beforeEach(function() {
      daoObj = new MongoDBConnector('design_patterns', 'alex.mongohq.com', 10001);
      return null;
    });
    it('Can be instatiated with paraneters', function(done) {
      daoObj.should.have.property('dbName', 'design_patterns');
      daoObj.should.have.property('host', 'alex.mongohq.com');
      daoObj.should.have.property('port', 10001);
      daoObj.should.have.property('db');
      should.exist(daoObj.db);
      daoObj.db.should.be.an["instanceof"](mongodb.Db);
      return done();
    });
    it('findAll returns the collection', function(done) {
      return daoObj.findAll(function(err, items) {
        items.should.be.an.instanceOf(Array);
        items.should.have.length(2);
        return done();
      });
    });
    it("count returns my collection's number", function(done) {
      return daoObj.count(function(err, count) {
        should.strictEqual(count, 2);
        return done();
      });
    });
    it("findByName with name = " + in_db_patterns_names.Singleton + " returns the " + in_db_patterns_names.Singleton + " pattern", function(done) {
      return daoObj.findByName(in_db_patterns_names.Singleton, function(err, item) {
        item.should.have.property('name', 'Singleton');
        return done();
      });
    });
    it("findByName with name = 'NoPattern' returns 404 error and {'message': 'document not found'}", function(done) {
      return daoObj.findByName('NoPattern', function(err, item) {
        should.strictEqual(err, 404);
        item.should.have.property('message', 'document not found');
        return done();
      });
    });
    it("insert a new document (" + new_pattern.name + ") returns the document", function(done) {
      return daoObj.insert(new_pattern, function(err, docs) {
        docs[0].should.have.property('name', new_pattern.name);
        return done();
      });
    });
    it("insert existing document with name = " + in_db_patterns_names.Singleton, function(done) {
      return daoObj.insert(test_pattern1, function(err, docs) {
        should.strictEqual(err, 400);
        docs.should.have.property('message', 'A document already exists with that id');
        return done();
      });
    });
    it("insert document with empty name returns 400 error and message", function(done) {
      test_pattern1.name = "";
      daoObj.insert(test_pattern1, function(err, docs) {
        should.strictEqual(err, 400);
        docs.should.have.property('message', 'You must insert an id value');
        return done();
      });
      return test_pattern1.name = "Singleton";
    });
    it("update the existing document '" + new_pattern.name + "' changes the document at database", function(done) {
      var new_category, old_category;
      old_category = new_pattern.category;
      new_category = "Modified Category";
      new_pattern.category = new_category;
      daoObj.update(new_pattern, function(err, item) {
        return daoObj.findByName(new_pattern.name, function(err, item) {
          item.should.have.property('category', new_category);
          return done();
        });
      });
      return new_pattern.category = old_category;
    });
    it("update the document 'NoDocument' (does'nt exist) returns 404 and document not found", function(done) {
      var old_name;
      old_name = new_pattern.name;
      new_pattern.name = 'NoDocument';
      daoObj.update(new_pattern, function(err, item) {
        should.strictEqual(err, 404);
        item.should.have.property('message', "document not found");
        return done();
      });
      return new_pattern.name = old_name;
    });
    it("delete the existing document '" + new_pattern.name + "' makes the db to have the original elements", function(done) {
      return daoObj["delete"](new_pattern.name, function(err, item) {
        return daoObj.count(function(err, count) {
          should.strictEqual(count, 2);
          return daoObj.findAll(function(err, items) {
            items.should.be.an.instanceOf(Array);
            items.should.have.length(2);
            in_db_patterns_names.should.have.property(items[0].name);
            in_db_patterns_names.should.have.property(items[1].name);
            return done();
          });
        });
      });
    });
    it("delete the document 'NoDocument' (does'nt exist) returns 404 and document not found", function(done) {
      return daoObj["delete"]('NoDocument', function(err, item) {
        should.strictEqual(err, 404);
        item.should.have.property('message', "document not found");
        return done();
      });
    });
    return it("deleteAll results on an empty collection", function(done) {
      return daoObj.deleteAll(function(err) {
        return daoObj.count(function(err, count) {
          should.strictEqual(count, 0);
          return done();
        });
      });
    });
  });

}).call(this);
