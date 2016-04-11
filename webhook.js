var http = require('http');
var config = require('./config');
var server = http.createServer(handleRequest);
server.listen(config.hookport);
var fullBody = "";

function handleRequest(req, res) {
  console.log(req.type);
  req.on('data', function(chunk) {
    // append the current chunk of data to the fullBody variable
    fullBody += chunk.toString();
  });
  //  var decodedBody = querystring.parse(fullBody);
  req.on('end', function() {
    if(fullBody.length>15){
    parser(JSON.parse(fullBody));}
    res.send("Gotcha");
  });

}


function parser(payload) {
  if (payload.eventID == 'mediaItem.live') {
    console.log("New live media with id " + payload.payload.id);
  }
  if (payload.eventID == 'mediaItem.showOver') {
    console.log("Show now over, id " + payload.payload.id);
  }
  if (payload.eventID == 'mediaItem.notLive') {
    console.log("Media item listed as not live " + payload.payload.id);
  }
  if (payload.eventID == 'mediaItem.vodAvailable') {
    console.log("New VOD media with id " + payload.payload.id);
  }
}
