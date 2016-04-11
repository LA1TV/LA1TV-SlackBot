var http = require('http');
var config = require('./config');
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
 console.log(payload)
 if (payload.eventID == 'mediaItem.live') {
    console.log("New live media with id " + payload.payload.id);
  }
  if (payload.eventId == 'mediaItem.showOver') {
    console.log("Show now over, id " + payload.payload.id);
  }
  if (payload.eventId == 'mediaItem.notLive') {
    console.log("Media item listed as not live " + payload.payload.id);
  }
  if (payload.eventId == 'mediaItem.vodAvailable') {
    console.log("New VOD media with id " + payload.payload.id);
  }
  if (payload.eventId == 'test') {
    console.log("Test response with message " + payload.payload.info);
  }
}
