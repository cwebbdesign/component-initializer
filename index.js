module.exports = function(opts) {
  'use strict';
  // Naive component intializer
  // ---------------------------

  // desirable implementation config:
  // initialize and load
  // or maybe not. just a generic implementation could work and then we move the logic into another place?
  // Todo: possibly return a queue of promises for components that are being initialized so that we can use $.when()
  // Todo: replace jquery deferreds

  // Declare Dependencies
  if (!opts) {
    opts = {};
  }
  var _ = require('lodash');
  var $ = opts.$ || require('jquery');
  var ns = opts.namespace || 'component';
  var Store = require('store-object');
  var initializeComponent = require('./lib/init').initialize;
  //var getInitialized = require('./lib/init').getInitialized;
  var domUtils = require('./lib/dom')({
    $: $,
    namespace: ns
  });
  var DOM = domUtils.returnElementArray;
  var generateConfig = domUtils.generateConfig;
  var logger = opts.logger || {
      log: function() {}
    };
  var asyncPath = opts.asyncBundlePath || '/dist/js/bundle.';

  // Begin Module
  // ----------------------------------
  var componentSource;
  var asyncComponentSource;
  var loadedAsyncComponents = {};


  // temporary until logger is updated
  if (console && console.log && !console.warn) {
    console.warn = console.log;
  }

  // Create a data source for all components loaded on page load
  componentSource = new Store('components')
    .populate(opts.componentSource.components);

  // Create a data source for all components loaded only when necessary
  asyncComponentSource = new Store('asyncComponents');
  //.populate(opts.componentSource.asyncComponents);

  // Takes an optional jQuery cached DOM element
  function initialize($container) {

    var name, component, config, components;

    // Search Dom for present components
    components = DOM($container);
    logger.log("Found: ", components);

    _.each(components, function(element) {
      config = generateConfig(element);
      name = config.name;

      component = componentSource.get(name);

      if (component) {
        logger.log('initializing', component.name, config);
        initializeComponent(component, config);
      } else {
        // todo: make this a onFallback callback
        loadComponent(name, config);
      }
    });
  }


  function loadComponent(name, config) {
    var promise = null;
    logger.log('Should load async component: ', name);
    // Check if there is a promise stored for this script,
    // if so attach handlers for initialization
    if (!opts.componentSource.asyncComponents[name]) {
      console.warn('Async component ', name, ' definition not found.');
      return;
    }

    if (loadedAsyncComponents[name]) {
      promise = loadedAsyncComponents[name];

    } else {

      // Create and store a reference to the script loading request
      promise = $.ajax({
        url: asyncPath + name + '.js'
        //, cache: false
      });
    }

    // Add handlers
    loadedAsyncComponents[name] = promise;
    loadedAsyncComponents[name]
      .done(function() {
        logger.log('Success: Component loaded: ', name);
        // Async requires are passed in a function to prevent
        // attempts to require the module before it's there
        var component = opts.componentSource.asyncComponents[name]();

        asyncComponentSource.add(component);
        initializeComponent(asyncComponentSource.get(name), config);
      })
      .fail(function() {
        console.log('Component not loaded:', name);
      });
  }

  return {
    initialize: initialize,
    //getInitialized: getInitialized
  };
};
