var Module = require('./module');

var ViewController = Module.extend({

	CONTROLLER: 'controller',
	BINDING:	'bind',
	COLLECTION: 'collection',
	CLICK: 		'click',

	DEBUG: 		true,

	init: function( options ) {
		this.super.init.call( this, options );
		this.controllers = {};
		this.instances = {};
		this.idIterator = 1;
		$( this.assignControllers.bind(this) );
	},

	register: function( id, module ) {
		/* Ensure the passed module is a proper module object */
		if ( typeof module === 'object' && typeof module.init === 'function' ) {
			/* Left as a straight assignment, if you override 
			 * an ID I'm assuming it's intended */
			this.controllers[id] = module;
			if ( this.DEBUG ) console.log('Registered: ' + id);
			if ( this.DEBUG ) console.log( '-------' );
		}
	},

	assignControllers: function() {
		var searchTerm = '[data-' + this.CONTROLLER + ']';
		$( searchTerm ).each( this.instanceController.bind(this) );
	},

	instanceController: function( index, item ) {
		var controller = this.controllers[ item.dataset[ this.CONTROLLER ] ];
		if ( controller ) {
			var instance = Object.create( controller );
			var id = this.defineScope( item, instance );
			this.instances[ id ] = instance;
			instance.init();

			if ( this.DEBUG ) console.log( 'Instance of ' + item.dataset[ this.CONTROLLER ] + ' created. id: ' + id );
			if ( this.DEBUG ) console.log( instance );
			if ( this.DEBUG ) console.log( '-------' );
		} else {
			if ( this.DEBUG ) console.log('Controller not defined.');
		}
	},

	defineScope: function( item, controllerInstance ) {
		/* If there's no explicit id already set in the HTML 
		 * assign a random one */
		var instanceId = item.dataset.instance || 'stv' + (0xFF + ( this.idIterator++ )).toString(16);

		/* create a group on the instance to hold declared elements 
		 * and assign the controller element as root */
		controllerInstance.elements = {};
		controllerInstance.elements.root = item;

		/* Populate our elements object with bindings
		 * collections and clicks (expandable) */
		this.assignBinds( item, controllerInstance );
		this.assignCollections( item, controllerInstance );
		this.assignClicks( item, controllerInstance );

		item.dataset.instance = instanceId;
		return instanceId;
	},

	assignBinds: function( item, controllerInstance ) {
		var searchTerm = '[data-' + this.BINDING +']';
		$(item).find( searchTerm ).each(function( index, item ) {
			controllerInstance.elements[ item.dataset[this.BINDING] ] = item;
		}.bind(this));
	},

	assignCollections: function( item, controllerInstance ) {
		var $el = $( item );
		var collections = [];

  		/* Construct an array of all the collection id's found */
		$el.find('[data-' + this.COLLECTION + ']').each(function() {
			if ( collections.indexOf( this.dataset.collection ) ) {
				collections.push( this.dataset.collection );
			}
		});

		/* Populate each collection type on the instance */
		for ( var i=0, len=collections.length; i<len; i++ ) {
			controllerInstance.elements[ collections[i] ] = [];
			$el.find('[data-' + this.COLLECTION + '=' + collections[i] + ']').each(function() {
				controllerInstance.elements[ collections[i] ].push(this);
			});
		}
	},

	assignClicks: function( item, controllerInstance ) {
		var $el = $( item );
		$el.find('[data-' + this.CLICK +']').each(function() {
			$(this).on('click', controllerInstance[this.dataset.click].bind(controllerInstance));
		});
	}

});

module.exports = ViewController.getInstance();