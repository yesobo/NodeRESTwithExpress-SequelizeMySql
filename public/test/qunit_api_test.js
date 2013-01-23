(function() {
  var api_test_GET, api_test_JSON, config, createUrl;

  api_test_JSON = function(url, type, data, callback) {
    return $.ajax({
      url: url,
      type: type,
      processData: false,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
      async: false,
      complete: function(result) {
        if (result.status === 0) {
          return ok(false, '0 status - browser could be on offline mode');
        } else if (result.status === 404) {
          return ok(false, '404 error');
        } else {
          return callback($.parseJSON(result.responseText));
        }
      }
    });
  };

  api_test_GET = function(url, callback) {
    return $.ajax({
      url: url,
      async: false,
      complete: function(result) {
        if (result.status === 0) {
          return ok(false, '0 status - browser could be on offline mode');
        } else if (result.status === 404) {
          return ok(false, '404 error');
        } else {
          return callback($.parseJSON(result.responseText));
        }
      }
    });
  };

  config = {
    host: 'http://localhost',
    port: 8010,
    apiRoot: '/api'
  };

  createUrl = function(resource) {
    return config.host + ':' + config.port + config.apiRoot + resource;
  };

  test("get all patterns synchronous", function() {
    return api_test_GET(createUrl('/patterns'), function(result) {
      return equal(result.length, 2, 'there are 2 patterns');
    });
  });

  asyncTest("get all patterns asynchronous", function() {
    $.ajax({
      url: createUrl('/patterns'),
      success: function(data, textStatus, jsXHR) {
        equal(data.length, 2, "there are 2 patterns");
        return notEqual(data.length, 3, "there are not 3 patterns");
      }
    });
    return setTimeout((function() {
      return start();
    }), 500);
  });

}).call(this);
