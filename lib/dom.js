module.exports = function(opts) {
  'use strict';

  // configuration options
  // A JQuery instance can be passed in which allows us to use the same instance of JQuery that would potentially
  // be used by browserify-shim.
  var $ = opts.$;
  var _ = require('lodash'); // todo: use lodash-node
  var parseOptions = require('./parseOptions');
  var ns = opts.namespace;

  // Returns an array of all elements with a given data-attribute namespace (ie. data-component-blah )
  function returnElementArray($container) {
    var nsp = '[data-' + ns + ']',
      // if an $el was given, then we scope our query to just look within the element
      DOM = $container ? $container.find(nsp) : $(nsp);

    return DOM;
  }

  // When passed a DOM selector, return a configuration object based on all data-attributes.
  function generateConfig(element) {
    var $el = $(element),
      data = $el.data(),
      config = {
        name: data[ns],
        $el: $el,
        opts: parseOptions(data),
        cid: _.uniqueId(ns + '-')
      };

    return config;
  }

  return {
    returnElementArray: returnElementArray,
    generateConfig: generateConfig
  };

};
