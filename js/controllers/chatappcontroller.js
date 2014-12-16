var Controller 		= require('../core/controller');
var MessageBroker 	= require('../core/messagebroker');

var ChatAppController = Controller.extend('ChatAppController', {

	init: function( options ) {
		Controller.init.call( this, options );

		/* Internal Event binds */
		this.channel = MessageBroker.getChannel('stvchat');
	}

});

module.exports = ChatAppController;