var SlackBot = require('slackbots');

var config = require('./config.json');

var channels = {};
// create a bot
var bot = new SlackBot({
  token: config.apikey,
  name: 'Clifford'
});

bot.on('start', function() {
  // more information about additional params https://api.slack.com/methods/chat.postMessage


  var params = {
    as_user: false,
    icon_url: 'http://vignette2.wikia.nocookie.net/clifford/images/e/ee/Art_clifford_laying.png',
  };

  // define existing username instead of 'user_name'
  //bot.postMessageToUser('joshhodgson', 'meow! :cat:', {username:"bot1", as_user: false}).then(function(data){console.log(JSON.stringify(data))});
  //bot.postMessageToChannel('random', "I'm lazy and do nothing", {username:"Stephen", as_user: false}).always(console.log);

  bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data);
  });

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
      bot.postMessageToChannel(channels[data.channel], "woof", {as_user:false, username: "Clifford", icon_url:"http://www.crazyabouttv.com/Images/cliffordbigreddog.jpg"});
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
