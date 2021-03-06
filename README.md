This is a bit of lightweight javascript framework to provide easy access to a traditional style class / inheritance structure combined with a global view controller which acts to automate instancing of scripts to dom and to provide some sugary helpers to make the writing of dom centric javascript a bit more elegant.

# Contents

- <a href="#the-module">The Module</a>
	- <a href="#moduleextend">Module.extend()</a>
	- <a href="#modulecreate">Module.create()</a>
	- <a href="#constructor--init">Constructor / init()</a>
	- <a href="#overloading-functions">Overloading Functions</a>
	- <a href="#singletons--getinstance">Singletons / getInstance()</a>

- <a href="#the-view-controller">The View Controller</a>
	- <a href="#viewcontrollerregister">ViewController.register()</a>


## Setup

For the purposes of getting this working. From terminal run:

	sudo npm install

Followed by 

	gulp

to run the watch script.

## Browserify

The system will work with anything if pulled in but is currently constructed with browserify in mind. 

# The Module

The module is a very simple class-style object wrapper. It's designed to make inheritance very accessible as well as obfuscating some of the uglier parts of instantiation and object cloning. 

The design uses 2 basic commands to inherit and instantiate modules.

## Module.extend()

Module.extend is the startpoint for any module definition. It's also how inherit any module to another. In effect every module you write is a descendant of 'Module'.

	var MyModule = Module.extend({

		func1: function() {

		},

		func2: function() {

		}

	});

## Module.create()

As each module is intended to act as a Class, you will never manipulate or call them directly. Instead the idea is to create an instance of the module and manipulate that instead. Module.create also accepts an options object which is in turn passed to the constructor function 'init' when create is called. More on init below.


	var myInstance = Module.create({ param1: '', param2: '' });

	myInstance.func1();
	myInstance.var = 10;

## Constructor / init()

As covered briefly in the last section, init is the default constructor function of any module. By adding init to any Module it will be involked automatically when instancing that Module with Module.create()

## Overloading functions

As with classical inheritence you can overload any existing function with a new one. The one which will almost always be overloaded is the init function, as it exists in the baseline module as your constructor.

The Module object has a unique property which gives access to it's parent Module named (aptly) super. This should be called on overloaded functions to execute both the original functionality and the new functionality. This should always be the case on init functions as the base module assigns with options object to your instance.

Ultimately when extending any class your overloaded init function should read as follows:

	var MyModule = Module.extend({

		init: function( options ) {
			this.super.init.call( this, options );

			// New code here
		},

		func1: function() {
			console.log('Function!');
		}
	
	});


This inheritence can be applied from any module that extends the base Module. In the next example we extend the module from the first example and overload func1.

	var YetAnotherModule = MyModule.extend({

		func1: function() {
			this.super.func1.call( this );
			console.log("Overload!");
		}

	});

	var yeAnotherModuleInstance = YetAnotherModule.create();

	yetAnotherModuleInstance.func1();

#### Result:

	> Function!
	> Overload!

## Singletons / getInstance()

A lot of the time the thing we require will be a shared singleton object. Something that should be persistant and required by multiple modules. For example, a global events object that everything listens to.

Given the nature of javascript objects we could directly manipulate our module definition and use it in such a way. For the sake of consistency however we want to instance the module and use this persistent instance so that the module can still be used with inheritence.

To this end we have a helper function available on all Module objects named getInstance(). This does exactly what it says on the tin, it returns a constant instance of the module in question, or the first time called will create that single instance.

	var instance = SingletonModule.getInstance();

regardless of where you call this from the instance will be shared making it perfect for 'globally' available objects while sticking to the require / module style of code organisation.

# The View Controller

The view controller is a singleton module that introduces the ability to integrate modules more seamlessly with the dom using a declarative format to instance and bind modules. 

## ViewController.register()

The register function binds a module to a specified id, turning it into an instancable view controller. 

	var viewController = ViewController.getInstance();

	var MyModule = Module.extend({ ... });

	viewController.register( 'MyModule', MyModule );

The id string is what we will use later in our HTML to declare an object as bound to the controller.

## Connecting to a controller

With the controller now registered, we're able to instance it by declaring a scope in the DOM using the data-controller attribute.

	<div data-controller="MyModule">
	...
	</div>

This will create an instance of MyModule, passing this div as the scope. This means that any declared bindings made within this div will automatically be made available to the Module instance.

## Bindings and the elements object.

Within the scope of any controller module you may declare dom elements to be automatically passed to your instance. We do this by means of several directives, the most basic being data-bind.

	<div data-controller="MyModule">
		<h1 data-bind="helloWorld">Hello World</h1>
	</div>

This example will send the h1 dom object to your MyModule instance, ready to be manipulated. 

### .elements

The way we expose bound items to the Module instance is through the elements object. It's simply an object that is autofilled with references to all bindings within your controller module scope.

	var viewController = ViewController.getInstance();

	var MyModule = Module.extend({
		init: function() {
			console.log( this.elements.helloWorld.innerHTML );
		}
	});

	viewController.register( 'MyModule', MyModule );

#### Result: 

	> Hello World!

### Currently Supported binding tags:

##### data-bind="{{id}}"

bind a single element.

##### data-collection="{{id}}"

bind multiple elements, adding an array to the elements object in sequential order. 

##### data-click="{{function}}"

bind a click event directly to a member function of the module controller. (this scope is always that of the controller, use e.currentTarget to get the clicked object. )

## Full Example

The full example, provided in the repo is for an uber basic slider, but shows how be registering the module controller we can simply declare that a piece of html is a slider, and it will automatically be executed upon.

Given that scope is controlled, we could run 50 sliders on a page by simply declaring them with the data- binds.

html:

	<div data-controller="SliderController">
		
		<div class="slider">
			<div class="slider__slide" data-collection="slides">
				<img src="http://www.placecage.com/320/200" alt="">
			</div>
			<div class="slider__slide" data-collection="slides">
				<img src="http://www.placecage.com/320/205" alt="">
			</div>
			<div class="slider__slide" data-collection="slides">
				<img src="http://www.placecage.com/320/210" alt="">
			</div>
			<div class="slider__slide" data-collection="slides">
				<img src="http://www.placecage.com/320/215" alt="">
			</div>
		</div>

		<button data-click="nextSlide">Next</button>
		<button data-click="prevSlide">Previous</button>

	</div>


slider javascript:

	/* Dependancies */
	var Module          = require('./module');
	var ViewController  = require('./viewcontroller');

	/* Our Module */
	var SliderController = Module.extend({

	    ACTIVE: 'is-active',

	    init: function( options ) {
	        this.super.init.call( this, options );
	        if ( this.elements.slides.length ) {
	            this.nSlides = this.elements.slides.length;
	            this.currentSlide = 0;
	            this.setSlide( 0 );
	        }
	    },

	    nextSlide: function() {
	        this.setSlide( this.currentSlide+1 );
	    },

	    prevSlide: function() {
	        this.setSlide( this.currentSlide-1 );
	    },

	    setSlide: function( targetSlide ) {
	        if ( targetSlide < 0 ) targetSlide = (this.nSlides-1);
	        if ( targetSlide > (this.nSlides-1) ) targetSlide = 0;

	        this.elements.slides[ this.currentSlide ].classList.remove( this.ACTIVE );
	        this.elements.slides[ targetSlide ].classList.add( this.ACTIVE );
	        this.currentSlide = targetSlide;
	    }

	});

	/* Exports */
	ViewController.register( 'SliderController', SliderController );
	module.exports = SliderController;


## Testing

Each instance on page is automatically assigned a unique sequential ID. To further facilitate unit testing the instance id can be overriden using an html declaration.

	<div data-controller="MyModule" data-instance="uniqueId">
	...
	</div>

This can then be pulled after dom ready by accessing the ViewController.

	var viewController = ViewController.getInstance();

	myTestingInstance = viewController.instances.uniqueId;

	