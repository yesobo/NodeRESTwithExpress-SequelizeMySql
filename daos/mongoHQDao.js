(function() {
  var MongoDBConnector, mongodb, util;

  mongodb = require('mongodb');

  util = require('util');

  module.exports = MongoDBConnector = (function() {
    var initTransaction;

    function MongoDBConnector(dbName, host, port) {
      this.dbName = dbName;
      this.host = host;
      this.port = port;
      this.db = new mongodb.Db(this.dbName, new mongodb.Server(this.host, this.port, {
        auto_reconnect: true
      }), {
        safe: true
      });
    }

    initTransaction = function(callback) {
      var privateDBName, privateDb;
      if (this.db._state === 'connected') {
        console.log("Conection opened");
        return this.db.collection(this.dbName, callback);
      } else {
        console.log("opening connection...");
        privateDb = this.db;
        privateDBName = this.dbName;
        return this.db.open(function(err, p_client) {
          if (err != null) {
            return console.log("ERROR opening connection: " + err);
          } else {
            console.log("connection opened");
            console.log("authenticating...");
            return privateDb.authenticate('admin', '1234', function(err) {
              console.log("autenticated!");
              return privateDb.collection(privateDBName, callback);
            });
          }
        });
      }
    };

    MongoDBConnector.prototype.findAll = function(callback) {
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR!");
          return callback(err, null);
        } else {
          return collection.find().toArray(function(err, items) {
            return callback(err, items);
          });
        }
      });
    };

    MongoDBConnector.prototype.count = function(callback) {
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR");
          return callback(err, null);
        } else {
          return collection.count(function(err, count) {
            return callback(err, count);
          });
        }
      });
    };

    MongoDBConnector.prototype.findByName = function(name, callback) {
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR!");
          return callback(err, null);
        } else {
          return collection.findOne({
            name: name
          }, function(err, item) {
            if (item === null) {
              err = 404;
              item = {
                "message": "document not found"
              };
            }
            return callback(err, item);
          });
        }
      });
    };

    MongoDBConnector.prototype.insert = function(pattern, callback) {
      var err, item;
      if (pattern.name === null || pattern.name === "") {
        err = 400;
        item = {
          'message': 'You must insert an id value'
        };
        return callback(err, item);
      } else {
        return initTransaction.call(this, function(err, collection) {
          if (err != null) {
            console.log("ERROR!");
            return callback(err, null);
          } else {
            return collection.findOne({
              name: pattern.name
            }, function(err, item) {
              if (item != null) {
                err = 400;
                item = {
                  "message": "A document already exists with that id"
                };
                return callback(err, item);
              } else {
                return collection.insert(pattern, function(err, doc) {
                  return callback(err, doc);
                });
              }
            });
          }
        });
      }
    };

    MongoDBConnector.prototype.update = function(pattern, callback) {
      var name, new_appli, new_cat, new_intent, new_motiv, new_struc;
      name = pattern.name;
      new_cat = pattern.category;
      new_intent = pattern.intent;
      new_motiv = pattern.motivation;
      new_appli = pattern.applicability;
      new_struc = pattern.structure;
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR!");
          return callback(err, null);
        } else {
          return collection.findOne({
            name: name
          }, function(err, item) {
            if (item != null) {
              return collection.update({
                name: name
              }, {
                $set: {
                  category: new_cat,
                  intent: new_intent,
                  motivation: new_motiv,
                  applicability: new_appli,
                  structure: new_struc
                }
              }, function(err, item) {
                return callback(err, item);
              });
            } else {
              err = 404;
              item = {
                "message": "document not found"
              };
              return callback(err, item);
            }
          });
        }
      });
    };

    MongoDBConnector.prototype["delete"] = function(pName, callback) {
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR!");
          return callback(err, "DB error");
        } else {
          return collection.findOne({
            name: pName
          }, function(err, item) {
            if (item != null) {
              return collection.remove({
                name: pName
              }, function(err) {
                return callback(err, {
                  "message": "item removed"
                });
              });
            } else {
              err = 404;
              item = {
                "message": "document not found"
              };
              return callback(err, item);
            }
          });
        }
      });
    };

    MongoDBConnector.prototype.deleteAll = function(callback) {
      return initTransaction.call(this, function(err, collection) {
        if (err != null) {
          console.log("ERROR!");
          return callback(err);
        } else {
          return collection.remove({}, function(err) {
            return callback(err);
          });
        }
      });
    };

    return MongoDBConnector;

  })();

}).call(this);
