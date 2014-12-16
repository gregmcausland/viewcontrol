var Module = require('./module');

var MessageChannel = Module.extend({

  events: {},

  init: function (options) {
    this.name = options.name || 'default';
  },

  /**
   * Register an event handler that will be called whenever `eventName` is
   * triggered
   *
   * @param  eventName  The name of the event
   * @param  handler    The handler function
   * @param  context    The value of `this` provided for the call to `handler` once triggered
   *
   * @return channelObj The channel object to facilitate chaining e.g. channel.on('event', func).on('otherEvent', otherFunc);
   */
  on: function (eventName, handler, context) {
    this.events[eventName] = this.events[eventName] || [];

	  this.events[eventName].push({
	    handler: handler,
	    context: context || null
	  });

	  return this;
	},

  /**
   * Register an event handler that will be called the first time `eventName` is triggered,
   *
   * @param  eventName  The name of the event
   * @param  handler    The handler function
   * @param  context    The value of `this` provided for the call to `handler` once triggered
   *
   * @return channelObj The channel object to facilitate chaining e.g. channel.on('event', func).on('otherEvent', otherFunc);
   */
  once: function (eventName, handler, context) {
    this.events[eventName] = this.events[eventName] || [];

    this.events[eventName].push({
      handler: handler,
      context: context || null,
      once: true
    });

    return this;
  },

  /**
   * Trigger an event and send some accompanying data
   *
   * @param eventName The name of the event to trigger
   * @param data      The data (usually an object) to send with the event
   *
   * @return channelObj The channel object to facilitate chaining e.g. channel.on('event', func).on('otherEvent', otherFunc);
   */
  trigger: function (eventName, data) {
    var handlers = this.events[eventName];

    if (typeof handlers !== 'undefined') {
      /* Iterate over all stored handlers */
      $.each(handlers, function (index, item) {
        /* Unbind the handler if it was registered with once() */
        if (item.once) handlers = handlers.splice(index, 1);
        /* Call the handler provided with `this` set to the instance */
        item.handler.call(item.context, data);
      });
    }

    return this;
  }

});

module.exports = MessageChannel;