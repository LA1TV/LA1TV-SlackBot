config.slackapikey = process.env.slackapikey
config.la1apikey = process.env.la1apikey
config.hookpassword = process.env.hookpassword



var SlackBot = require('slackbots');
var CronJob = require('cron').CronJob;
var Webhook = require('./webhook');
var webhook = new Webhook();

var website = require("./la1api");

var Clifford = require('./bots/clifford'),
  Stephen = require('./bots/stephen'),
  Cynthia = require('./bots/cynthia'),
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

  //Begin Webhook integration
  webhook.on("vod", function(payload) {
    website.apiRequest("mediaItems/" + payload.payload.id, function(data) {
      var message = data.data.mediaItem.name + " in " + data.data.playlists[0].name + " now has VOD. Watch it at " + data.data.mediaItem.siteUrl + " .... woof!";
      clifford.postToChannel('streammonitoring', message, {
        as_user: true
      });
    });
  });

  //Begin Webhook integration
  webhook.on("live", function(payload) {
    website.apiRequest("mediaItems/" + payload.payload.id, function(data) {
      var message = data.data.mediaItem.name + " in " + data.data.playlists[0].name + " is now live. Watch it at " + data.data.mediaItem.siteUrl + " .... woof!";
      clifford.postToChannel('streammonitoring', message, {
        as_user: true
      });
    });
  });

  //Begin Webhook integration
  webhook.on("notLive", function(payload) {
    website.apiRequest("mediaItems/" + payload.payload.id, function(data) {
      var message = data.data.mediaItem.name + " in " + data.data.playlists[0].name + " is no longer live. " + data.data.mediaItem.siteUrl + " .... woof!";
      clifford.postToChannel('streammonitoring', message, {
        as_user: true
      });
    });
  });

  //Begin Webhook integration
  webhook.on("showOver", function(payload) {
    website.apiRequest("mediaItems/" + payload.payload.id, function(data) {
      var message = data.data.mediaItem.name + " in " + data.data.playlists[0].name + " has now finished. Watch it at " + data.data.mediaItem.siteUrl + " .... woof!";
      clifford.postToChannel('streammonitoring', message, {
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
    clifford.postToChannel('monitoring', msg, {
      as_user: true
    });
  });

  var vodUploadCheckJob = new CronJob({
    cronTime: '00 00 13 * * *',
    onTick: function() {
      console.log("Looking for media items missing vod...");
      website.apiRequest("mediaItems?sortMode=SCHEDULED_PUBLISH_TIME&sortDirection=DESC&limit=100", function(data) {
        var needVod = data.data.mediaItems.filter(function(mediaItem) {
          var shouldHaveVod =
            // live stream ended and marked as being recorded
            (mediaItem.liveStream && mediaItem.liveStream.state === "SHOW_OVER" && mediaItem.liveStream.beingRecorded) ||
            // vod scheduled to go live within 2 days
            (mediaItem.vod && mediaItem.vod.scheduledPublishTime >= (Date.now()/1000)-172800);
          // has vod or vod is currently processing
          var hasVod = mediaItem.vod && (mediaItem.vod.processing.completed || !mediaItem.vod.processing.error);
          return shouldHaveVod && !hasVod;
        });
        if (!needVod.length) {
          // all good
          return
        }

        var msg = "The following items need VOD uploading:\r\n"+needVod.map(function(mediaItem) {
          return "- "+mediaItem.name+" ("+mediaItem.siteUrl+")";
        }).join("\r\n")+"\r\n...woof";
        clifford.postToChannel('production', msg, {
          as_user: true
        });
      });
    },
    runOnInit: true,
    timeZone: 'Europe/London'
  });
  vodUploadCheckJob.start();
});
