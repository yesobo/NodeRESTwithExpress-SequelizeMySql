(function() {
  var UrlValidator, winston,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  winston = require('winston');

  module.exports = UrlValidator = (function() {

    function UrlValidator(findOptions, pageOptions) {
      this.findOptions = findOptions;
      this.pageOptions = pageOptions;
    }

    UrlValidator.prototype.isValidRequest = function(request) {
      var allowedOptions, errorFound, i, key, usedOptionsObj, value;
      usedOptionsObj = request.query;
      allowedOptions = this.findOptions.concat(this.pageOptions);
      errorFound = false;
      i = 0;
      for (key in usedOptionsObj) {
        value = usedOptionsObj[key];
        errorFound = !(__indexOf.call(allowedOptions, key) >= 0);
        i += 1;
      }
      return !errorFound;
    };

    return UrlValidator;

  })();

}).call(this);
