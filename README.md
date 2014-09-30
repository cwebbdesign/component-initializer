# Component Initializer

Component initializer facilitates declaring and initializing javascript components with data-attributes. Currently component initializer makes use of component maker. In the future these two will be further separated so that the initializer can be used without the maker.

Component initializer finds all DOM elements with a data-component attribute. It parses any other 'data-component-' attributes into an options hash and creates a component with them and then calls .initialize();

## Installation

    npm install component-initializer

## Usage

    var initializer = require('component-initializer')({
      // $: pass a reference to jquery if its already being used
      // namespace: by default it's 'component'
      // tell initializer where it will find the component objects
      // componentSource: {components: [require('mycomponent')], asyncComponents: []}
    });
    
    initializer.initialize('#myDomElement');
    
   