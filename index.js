var config = require('./config.json');


var SlackBot = require('slackbots');
var Webhook = require('./webhook');
var webhook = new Webhook();

var website = require("./la1api");

var Clifford = require('./bots/clifford'),
  Stephen = require('./bots/stephen'),
  Cynthia = require('./bots/cynthia');
  Sarah = require('./bots/sarah');

var stephen,
  cynthia,
  clifford,
  sarah;


var bot = new SlackBot({
  token: config.apikey,
  name: 'Clifford'
});

bot.on('start', function() {
  stephen = new Stephen(bot);
  cynthia = new Cynthia(bot);
  clifford = new Clifford(bot);
  sarah = new Sarah(bot);
});

//Begin Webhook integration

webhook.on('vod live notLive showOver', function(payload) {
  website.apiRequest("mediaItems/" + payload.payload.id, function(data) {
    var message = "Something is happenening on the website with " + data.data.mediaItem.name + " in " + data.data.playlists[0].name + ". Watch it at " + data.data.mediaItem.siteUrl + " .... woof!";
    clifford.postToChannel('streammonitoring', message);
  });
});

webhook.on('degradedServiceStateChanged', function(enabled) {
  var msg = null;
  if (enabled) {
    msg = 'The site has gone into degraded service mode :disappointed: .... woof! /giphy explosion';
  } else {
    msg = 'The site has left degraded service mode :smile: .... woof! /giphy chill';
  }
  clifford.postToChannel('monitoring', msg, {
    as_user: true
  });
});
