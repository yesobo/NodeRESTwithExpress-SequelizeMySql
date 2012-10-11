// Generated by CoffeeScript 1.3.3
(function() {
  var connection_uri, db_name, log, mongodb, url;

  mongodb = require('mongodb');

  url = require('url');

  log = console.log;

  connection_uri = "mongodb://admin:1234@alex.mongohq.com:10001/design_patterns";

  db_name = connection_uri.pathname.replace(/^\//, '');

  mongodb.Db.connect(process.env.MONGOHQ_URL, function(error, client) {
    if (error) {
      throw error;
    }
    return client.collectionNames(function(error, names) {
      var col_data, col_name, collection, documents, last_collection, _i, _len;
      if (error) {
        throw error;
      }
      log("Collections");
      log("===========");
      last_collection = null;
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        col_data = names[_i];
        col_name = col_data.name.replace("" + db_name + ".", '');
        log(col_name);
        last_collection = col_name;
      }
      collection = new mongodb.Collection(client, last_collection);
      log("\nDocuments in " + last_collection);
      documents = collection.find({}, {
        limit: 5
      });
      return documents.count(function(error, count) {
        log(" " + count + " document(s) found");
        log("===========================");
        return documents.toArray(function(error, docs) {
          var doc, _j, _len1;
          if (error) {
            throw error;
          }
          for (_j = 0, _len1 = docs.length; _j < _len1; _j++) {
            doc = docs[_j];
            log(doc);
          }
          return client.close();
        });
      });
    });
  });

}).call(this);
