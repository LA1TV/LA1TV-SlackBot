var http = require('http');
var config = require('./config');
var events = require('events').EventEmitter;


function webhook() {
  events.EventEmitter.call(this);
  var that = this;
  var server = http.createServer(handleRequest);
  server.listen(config.hookport);

  function handleRequest(req, res) {
    var fullBody = ""
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    //  var decodedBody = querystring.parse(fullBody);
    req.on('end', function() {
      if (fullBody.length > 5) {
        parser(JSON.parse(fullBody));
      }
      res.end("Gotcha");
    });

  }


  function parser(payload) {
    that.emit('data', payload)
    console.log(payload)
    if (payload.eventID == 'mediaItem.live') {
      that.emit('live', payload);
      console.log("New live media with id " + payload.payload.id);
    }
    if (payload.eventId == 'mediaItem.showOver') {
      that.emit('showOver', payload);
      console.log("Show now over, id " + payload.payload.id);
    }
    if (payload.eventId == 'mediaItem.notLive') {
      that.emit('notLive', payload);
      console.log("Media item listed as not live " + payload.payload.id);
    }
    if (payload.eventId == 'mediaItem.vodAvailable') {
      that.emit('vod', payload);
      console.log("New VOD media with id " + payload.payload.id);
    }
    if (payload.eventId == 'test') {
      that.emit('test', payload);
      console.log("Test response with message " + payload.payload.info);
    }
  }
}

webhook.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = webhook;
