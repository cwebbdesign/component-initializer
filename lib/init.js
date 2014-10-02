module.exports = (function() {
  'use strict';

  // Declare dependencies
  var make = require('component-maker');
  var _ = require('lodash');

  // Begin module
  // var initialized = [];

  // Initialize Component
  function initializeComponent(component, config) {

    var augmentedComponent = make(component, config);

    if (augmentedComponent && _.isFunction(augmentedComponent.initialize)) {
      // initialized.push(augmentedComponent);
      augmentedComponent.initialize(config);
      // TODO: somehow do this with the store.js. it shouldn't be that hard.
      // initialized.push(augmentedComponent); // not doing much with this yet... but hey maybe one day
    }
  }

  //function getInitialized () {
  //  return initialized;
  //}

  return {
    initialize: initializeComponent,
    // getInitialized: getInitialized
  };
}());

