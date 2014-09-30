module.exports = (function() {
  'use strict';
  var _ = require('lodash');

  // Utility
  // ---------------------------------------
  function parseOptions(data) {
    var opts = {}, // we should work to cache this one day
      test = new RegExp("component"); // we only want the data-component attributes.

    _.each(data, function(value, key) {

      if (key.match(test)) {
        key = key.replace(new RegExp("component"), "");
        key = key.charAt(0).toLowerCase() + key.slice(1);

        if (key) {
          opts[key] = value;
        }
      }
    });


    return opts;
  }
  return parseOptions;
}());

