var Module = require('./module');
var MessageChannel = require('./messagechannel');

var MessageBroker = Module.extend({

  channels: {},

  /**
   * Returns an MessageChannel with listen and trigger methods for the specified
   * channel
   *
   * @param  channelName   The name of the channel you wish to use
   *
   * @return MessageChannel A channel object with listen and trigger methods
   */
  getChannel: function (channelName) {
    var self = this,
        channel;

    if (typeof channelName === 'undefined') channelName = 'default';

    if (!this.channels.hasOwnProperty(channelName)) {
      channel = MessageChannel.create({
        name: channelName
      });
    } else {
      channel = this.channels[channelName]; 
    }

    return channel;
  }

});

module.exports = MessageBroker.getInstance();