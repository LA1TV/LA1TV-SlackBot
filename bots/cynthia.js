var params = {
  as_user: false,
  username: "Cynthia",
  icon_emoji: ":beer:"
};

function Cynthia(bot) {
  var channels = {};

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
   * Defining some things Cynthia can do
   *
   */
  this.postToChannel = function(channel, message) {
    bot.postToChannel(channel, message, params).fail(console.log);
  };
  this.postToUser = function(user, message) {
    bot.postToUser(user, message, params).fail(console.log);
  };
  this.postToGroup = function(group, message) {
    bot.postToGroup(group, message, params).fail(console.log);
  };
  /*
   *
   *Defining listeners
   *
   */

  bot.on('message', function(data) {
    if (data.type === 'message') {
      if (data.text.toLowerCase().indexOf("cynthia") > -1) {
        this.postMessageToChannel(channels[data.channel], "I will kill you :knife:", {
          username: "Cynthia",
          icon_emoji: ":knife:",
          as_user: false
        });
      }
    }
  });

}

module.exports = Cynthia;
