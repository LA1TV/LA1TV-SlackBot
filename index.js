var SlackBot = require('slackbots');
var Webhook = require('./webhook');
var webhook = new Webhook();

var config = require('./config.json'); //just .apikey at the minute

var channels = {};

var bot = new SlackBot({
  token: config.apikey,
  name: 'Clifford'
});

bot.on('start', function() {

//This is where the bodging commenses - to send a message to a channel, we need to know its name, so
//    we store the names in an object, referenced by their ID (tagged in all incoming messages)
  bot.getChannels().then(function(data) {
    var users=[];
    for(var i in data.channels){
      var id = data.channels[i].id;
      var name = data.channels[i].name;
      channels[id]=name;
    }
  });


  bot.on('message', function(data) {
  if (data.type == 'message'){

    if (data.text.toLowerCase().indexOf("clifford")>-1){
      bot.postMessageToChannel(channels[data.channel], "woof", {as_user:false, username: "Clifford"});
    }

    if (data.text.toLowerCase().indexOf("cynthia")>-1){
      bot.postMessageToChannel(channels[data.channel], "I will kill you :knife:", {username: "Cynthia", icon_emoji: ":knife:", as_user:false});
    }

    if (data.text.toLowerCase().indexOf("stephen")>-1){
      bot.postMessageToChannel(channels[data.channel], "fuck fuck fuck fuck fuck", {username: "Stephen", icon_emoji: ":beer:", as_user:false});
    }
  }
  });
});

//Begin Webhook integration

webhook.on('data', function(payload){
  bot.postMessageToUser('joshhodgson', 'New data! ' + payload.payload)
})
