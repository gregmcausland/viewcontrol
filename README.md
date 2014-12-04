# View Controller

This is a bit of lightweight javascript framework to provide easy access to a traditional style class / inheritance structure combined with a global view controller which acts to automate instancing of scripts to dom and to provide some sugary helpers to make the writing of dom centric javascript a bit more elegant.

## Setup

For the purposes of getting this working. From terminal run:

	sudo npm install

Followed by 

	gulp

to run the watch script.

## Browserify

The system will work with anything if pulled in but is currently constructed with browserify in mind. 

## The Module

The module is a very simple class-style object wrapper. It's designed to make inheritance very accessible as well as obfuscating some of the uglier parts of instantiation and object cloning. 

The design uses 2 basic commands to inherit and instantiate modules.

### Module.extend

Module.extend is the startpoint for any module definition. It's also how inherit any module to another. In effect every module you write is a desendant of 'Module'.

	var MyModule = Module.extend({

		func1: function() {

		},

		func2: function() {

		}

	});

### Module.create

As each module is intended to act as a Class, you will never manipulate or call them directly. Instead the idea is to create an instance of the module and manipulate that instead. Module.create also accepts an options object which is in turn passed to the constructor function 'init' when create is called. More on init below.


	var myInstance = Module.create({ param1: '', param2: '' });

	myInstance.func1();
	myInstance.var = 10;

### Constructor / init

As covered briefly in the last section, init is the default constructor function of any module. By adding init to any Module it will be involked automatically when instancing that Module with Module.create()

### Overloading functions

As with classical inheritence you can overload any existing function with a new one. The one which will almost always be overloaded is the init function, as it exists in the baseline module as your constructor.

The Module object has a unique property which gives access to it's parent Module named (aptly) super. This should be called on overloaded functions to execute both the original functionality and the new functionality. This should always be the case on init functions as the base module assigns with options object to your instance.

Ultimately when extending any class your overloaded init function should read as follows:

	var MyModule = Module.extend({

		init: function( options ) {
			this.super.init.call( this, options );

			// New code here
		},

		func1: function() {

		}
	
	});


This inheritence can be applied from any module that extends the base Module. In the next example we extend the module from the first example and overload func1.

	var YetAnotherModule = MyModule.extend({

		func1: function() {
			this.super.func1.call( this );
			alert("Overload!");
		}

	});

### Singletons

