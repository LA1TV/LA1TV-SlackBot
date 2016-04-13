var config = require('./config.json');


var SlackBot = require('slackbots');
var Webhook = require('./webhook');
var webhook = new Webhook();
var request = require('request');


var channels = {};

var bot = new SlackBot({
  token: config.apikey,
  name: 'Clifford'
});

bot.on('start', function() {

  //This is where the bodging commenses - to send a message to a channel, we need to know its name, so
  //    we store the names in an object, referenced by their ID (tagged in all incoming messages)
  bot.getChannels().then(function(data) {
    for (var i in data.channels) {
      if (data.channels[i].id) {
        var id = data.channels[i].id;
        var name = data.channels[i].name;
        channels[id] = name;
      }
    }
  });

  bot.on('message', function(data) {
    if (data.type === 'message') {

      if (data.text.toLowerCase().indexOf("clifford") > -1) {
        bot.postMessageToChannel(channels[data.channel], "woof", {
          as_user: true
        });
      }

      if (data.text.toLowerCase().indexOf("cynthia") > -1) {
        bot.postMessageToChannel(channels[data.channel], "I will kill you :knife:", {
          username: "Cynthia",
          icon_emoji: ":knife:",
          as_user: false
        });
      }

      if (data.text.toLowerCase().indexOf("stephen") > -1) {
        bot.postMessageToChannel(channels[data.channel], "fuck fuck fuck fuck fuck", {
          username: "Stephen",
          icon_emoji: ":beer:",
          as_user: false
        });
      }
    }
  });
});

//Begin Webhook integration

webhook.on('data', function(payload) {
  bot.postMessageToUser('joshhodgson', 'New data! ' + JSON.stringify(payload));
});

//Begin API integration
var apiBaseUrl = "https://www.la1tv.co.uk/api/v1";

function apiRequest(url, callback) {
  console.log("Making api request.", url);
  request({
    url: apiBaseUrl + "/" + url,
    headers: {
      "X-Api-Key": config.la1apikey
    }
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("Api request completed.");
      callback(JSON.parse(body));
    } else if (!error && response.statusCode === 404) {
      console.log("Api request completed but a 404 was returned.");
      callback(null);
    } else {
      console.log("Error making request to api. Retrying shortly.");
      setTimeout(function() {
        apiRequest(url, callback);
      }, 5000);
    }
  });
}

webhook.on('vod live notLive showOver', function(payload) {
  apiRequest("mediaItems/" + payload.payload.id, function(data) {
    var name = data.data.mediaItem.name + " in " + data.data.playlists[0].name + ". Watch it at " + data.data.mediaItem.siteUrl;
    bot.postMessageToUser('joshhodgson', 'Something is happening on the website with ' + name, {
      as_user: true
    });
    bot.postMessageToChannel('streammonitoring', 'Somthing is happening on the website with ' + name + ' .... woof!', {
      as_user: true
    });
  });
});

webhook.on('degradedServiceStateChanged', function(enabled) {
  var msg = null;
  if (enabled) {
    msg = 'The site has gone into degraded service mode :disappointed: .... woof!';
  } else {
    msg = 'The site has left degraded service mode :smile: .... woof!';
  }
  bot.postMessageToChannel('monitoring', msg, {
    as_user: true
  });
});
