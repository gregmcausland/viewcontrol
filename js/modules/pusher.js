var Module 			= require('../core/module');
var MessageBroker 	= require('../core/messagebroker');

var Pusher = Module.extend({

	init: function( options ) {
		Module.init.call( this, options );
		this.channel = MessageBroker.getChannel('stvchat');
	},

	send: function() {
	}

});

module.exports = Pusher;