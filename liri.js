var fs = require("fs");
var request = require("request");
var spotify = require("spotify");
var twitter = require("twitter");
var myKeys = require("./keys.js");
var twitterClient = new twitter(myKeys.twitterKeys);
var firstInput = process.argv[2];
var latterInputs = process.argv;

spotify.search({ type: "track", query: "i+want+it+that+way", limit: "1" }, function(err, data) {
	var res = data.tracks.items[0];
	console.log("Artist(s): " + res.album.artists[0].name);
	console.log("Song title: " + res.name);
	console.log("Album title: " + res.album.name);
	console.log("Link to preview at Spotify: " + res.preview_url);
	// var trackuri = data.tracks.items[0].uri;
	// console.log(trackuri);

	// spotify.lookup({ type: "track", id: "6e40mgJiCid5HRAGrbpGA6" }, function (err, data) {
	// 	console.log(data);
	// });
});


twitterClient.get("statuses/user_timeline", {screen_name: "StephenAtHome", count: "20"}, function(err, tweets, response) {
 	for (var i = 0; i < 20; i++) {
 		console.log("TWEET #" + (i + 1) + "  " + tweets[i].text);
 	}
});
