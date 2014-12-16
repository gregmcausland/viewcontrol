var Controller 		= require('../core/controller');
var MessageBroker 	= require('../core/messagebroker');

var ChatInputController = Controller.extend('ChatInputController', {

	init: function( options ) {
		Controller.init.call( this, options );
		this.channel = MessageBroker.getChannel('stvchat');

		$(this.elements.chatInput).focus();
	},

	submit: function( e ) {
		e.preventDefault();
		var msg = this.elements.chatInput.value;
		if ( msg.length ) {
			// Reset the input
			this.elements.chatInput.value = '';
			// Send the message
			this.channel.trigger('new-message', {
				message: msg
			});
		}
	}

});

module.exports = ChatInputController;