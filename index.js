var SlackBot = require('slackbots');

var config = require('./config.json');

var channels = {};

var bot = new SlackBot({
  token: config.apikey,
  name: 'Clifford'
});

bot.on('start', function() {

  var params = {
    as_user: false,
    icon_url: 'http://vignette2.wikia.nocookie.net/clifford/images/e/ee/Art_clifford_laying.png',
  };

  bot.getChannels().then(function(data) {
    var users=[];
    for(var i in data.channels){
      var id = data.channels[i].id;
      var name = data.channels[i].name;
      channels[id]=name;
    }
  });


  bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
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
