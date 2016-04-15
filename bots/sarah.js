var params = {
  as_user: false,
  username: "Sarah",
  icon_emoji: ":cat:"
};

function Sarah(bot) {
  var channels = {};
  var self = this;

  /*
   *
   * Hacking the system to allow matching groups by ID to Name
   *
   */

  bot.getChannels().then(function(data) {
    for (var i in data.channels) {
      if (data.channels[i].id) {
        var id = data.channels[i].id;
        var name = data.channels[i].name;
        channels[id] = name;
      }
    }
  });

  /*
   *
   * Defining some things Sarah can do
   *
   */
  this.postToChannel = function(channel, message) {
    bot.postMessageToChannel(channel, message, params).fail(console.log);
  };
  this.postToUser = function(user, message) {
    bot.postMessageToUser(user, message, params).fail(console.log);
  };
  this.postToGroup = function(group, message) {
    bot.postMessageToGroup(group, message, params).fail(console.log);
  };
  /*
   *
   *Defining listeners
   *
   */

  bot.on('message', function(data) {
    if (data.type === 'message') {
      if (data.text.toLowerCase().indexOf("sarah") > -1) {
        self.postToChannel(channels[data.channel], "I am bacon.");
      }
    }
  });

}

module.exports = Sarah;
