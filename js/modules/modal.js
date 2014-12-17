var Module 			= require('../core/module');

var Modal = Module.extend({

	init: function( options ) {
		Module.init.call( this, options );
	}
	
});

module.exports = Modal.getInstance();