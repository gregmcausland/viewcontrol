var Controller 		= require('../core/controller');
var MessageBroker 	= require('../core/messagebroker');

var ChatWindowController = Controller.extend('ChatWindowController', {

	init: function( options ) {
		Controller.init.call(this, options);
		
		// Internal message list
		this.messageList = [];
		this.messageTemplate = '<ul class="list-group">{{#messages}} <li class="list-group-item"><strong>{{username}}</strong> : {{message}}</li> {{/messages}}</ul>';

		// Events
		this.channel = MessageBroker.getChannel('stvchat');
		this.channel
			.on('new-message', this.addMessage, this);
	},

	addMessage: function( data ) {
		if ( !data.message ) return;
		this.messageList.push({ username: 'user', message: data.message });
		this.render();
	},

	render: function() {
		this.elements.dropZone.innerHTML = Mustache.render( this.messageTemplate, { messages: this.messageList });
	}

});

module.exports = ChatWindowController;