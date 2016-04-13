var params = {
  as_user: false,
  username: "Cynthia",
  icon_emoji: ":knife:"
};

function Cynthia(bot) {
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
   * Defining some things Cynthia can do
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
      if (data.text.toLowerCase().indexOf("cynthia") > -1) {

        if (data.text.toLowerCase().indexOf("kill") > -1) {
          self.postToChannel(channels[data.channel], "I will kill " + whoToKill(data.text) + " :knife:");
        } else {
          self.postToChannel(channels[data.channel], "I will kill you :knife:");
        }

      }
    }
  });

}


function whoToKill(message) {
  var words = message.split(String.fromCharCode(32)); //ascii code for space is 32.
  var wordsLC = [];
  for (var i in words) {
    if (words[i]) {
      wordsLC[i] = words[i].toLowerCase();
    }
  }
  if (wordsLC[words.length - 1] !== "kill") {
    var victimId = wordsLC.indexOf("kill") + 1;
    var victim = words[victimId];
    if(victim.toLowerCase().indexOf("cynthia") > -1){
      return victim;
    }else{
      return "you, not me";
    }
  } else {
    return "you";
  }
}



module.exports = Cynthia;
