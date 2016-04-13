var params = {
  as_user: true
};

function Clifford(bot) {
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
   * Defining some things Clifford can do
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
      if (data.text.toLowerCase().indexOf("clifford") > -1) {
        Clifford.postToChannel(channels[data.channel], "Woof!");
      }
    }
  });

}

module.exports = Clifford;
