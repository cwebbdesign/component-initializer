// Dependencies
// --------------------------------------------------------------

// Test environment
var chai = require('chai'); // Test assertions that are expressive and readable
var should = chai.should();
//var expect = chai.expect;
var sinon = require('sinon');
var jsdom = require('jsdom'); // A JavaScript implementation of the WHATWG DOM and HTML standards.
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: ['script', 'img', 'css', 'frame', 'iframe', 'link'],
  ProcessExternalResources: ['script', 'img', 'css', 'frame', 'link']
};
var _ = require('lodash');

// Stub the browser window
var document = jsdom.jsdom('<html><head></head><body></body></html>');
var window = document.parentWindow;
var $ = require('jquery')(window); // Add jquery
window.$ = $;
var fixture = '<div id="test"> <div data-component="test" data-component-color="blue">la</div></div>';


// Things we are testing
var initializer = require('../index');
var initializeComponent = require('../lib/init').initialize;

var domUtils = require('../lib/dom')({
  $: $,
  namespace: 'component'
});
var DOM = domUtils.returnElementArray;
var generateConfig = domUtils.generateConfig;


// Tests
// ----------------------------------------------------------------
describe('Initializer', function() {
  'use strict';

  var component;

  // Setup each test
  beforeEach(function() {

    window.$('body').append(fixture);
    component = {
      name: 'test',
      $el: window.$('#test'),
      initialize: sinon.spy()
    };

  });

  // Clean up after each test
  afterEach(function() {
    window.$('#test').remove();
    component = null;
  });


  // it('Should accept a custom namespace');

  it('Should initialize components that it knows about', function() {
    var opts = {
      $: $,
      namespace: 'component',
      componentSource: {
        components: [component],
        asyncComponents: []
      }
    };
    var init = initializer(opts);

    init.initialize();
    component.initialize.called.should.equal(true);
    //init.getInitialized()[0].name.should.equal('test');
  });

  it('Should try to load components it doesn\'t know about');

  describe('DOM Utils', function() {
    it('Should find all components in the DOM', function() {
      var components = DOM(window.$('#test'));
      components.length.should.equal(1);
    });

    it('Should parse component options from data attributes', function() {
      var components = DOM(window.$('#test'));
      var config = generateConfig(components[0]);

      config.opts.color.should.equal('blue');
    });
  });

  describe('init', function() {

    it('Should call component.initialize() if it exists with any configuration options', function() {
      var comp = {
        name: 'test1',
        $el: window.$('#test'),
        initialize: sinon.spy()
      };
      var config = {
        color: 'blue'
      }

      initializeComponent(comp, config);


      comp.initialize.called.should.equal(true);
      comp.initialize.calledWith(config).should.equal(true);
    });

  });

});