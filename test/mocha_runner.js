(function() {
  var Mocha, failed, mocha, passed,
    _this = this;

  Mocha = require('../node_modules/mocha');

  mocha = new Mocha();

  passed = failed = [];

  mocha.addFile('mocha_api_test');

  mocha.run();
  /*
  mocha.run(function() {
    var testName, _i, _j, _len, _len1, _results;
    console.log(passed.length + 'Test passed');
    for (_i = 0, _len = passed.length; _i < _len; _i++) {
      testName = passed[_i];
      console.log('Passed' + testName);
    }
    console.log('\n' + failed.length + ' Tests failed');
    _results = [];
    for (_j = 0, _len1 = failed.length; _j < _len1; _j++) {
      testName = failed[_j];
      _results.push(console.log('Failed:', testName));
    }
    return _results;
  }).on('fail', function(test) {
    return failed.push(test.title);
  }).on('pass', function(test) {
    return passed.push(test.title);
  });
*/

}).call(this);