var request = require('request');
var apiBaseUrl = "https://www.la1tv.co.uk/api/v1";


function apiRequest(url, api, callback) {
  console.log("Making api request.", url);
  request({
    url: apiBaseUrl + "/" + url,
    headers: {
      "X-Api-Key": api
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

module.exports.apiRequest = apiRequest;
