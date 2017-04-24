var fs = require("fs");
var request = require("request");
var spotify = require("spotify");
var twitter = require("twitter");
var myKeys = require("./keys.js");
var twitterClient = new twitter(myKeys.twitterKeys);
var firstInput = process.argv[2];
var allInputs = process.argv;
var title = "";

switch (firstInput) {
	case "my-tweets":
		tweets();
		break;

	case "spotify-this-song":
		if (allInputs.length === 3) {
			ace();
		} else {
			plusConcat();
		}
		break;

	case "movie-this":
		if (allInputs.length === 3) {
			movie("Mr.+Nobody");
		} else {
			plusConcat();
		}
}

function plusConcat() {
	for (var i = 3; i < allInputs.length; i++) {
		if (i > 3 && i < allInputs.length) {
			title = title + "+" + allInputs[i];
		} else {
			title = allInputs[i];
		}
	}
	console.log(title);
	if (firstInput === "spotify-this-song") {
		song(title);
	} else {
		movie(title);
	}
}

function tweets() {
	twitterClient.get("statuses/user_timeline", { screen_name: "StephenAtHome", count: "20" }, function(err, tweets, response) {
	 	for (var i = 0; i < 20; i++) {
	 		console.log("TWEET #" + (i + 1) + " - " + tweets[i].text + " CREATED: " + tweets[i].created_at);
	 	}
	});
}

function ace() {
	spotify.search({ type: "track", query: "The+Sign" }, function(err, data) {
		var res = data.tracks.items[3];
		console.log("Artist(s): " + res.album.artists[0].name);
		console.log("Song title: " + res.name);
		console.log("Album title: " + res.album.name);
		console.log("Link to preview at Spotify: " + res.preview_url);
	});
}

function song(input) {
	spotify.search({ type: "track", query: input }, function(err, data) {
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
}

function movie(input) {
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json&tomatoes=true";
	request(queryUrl, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			var res = JSON.parse(body);
			console.log("Title: " + res.Title);
			console.log("Year: " + res.Year);
			console.log("IMDB Rating: " + res.imdbRating);
			console.log("Country or Countries of Production: " + res.Country);
			console.log("Language(s): " + res.Language);
			console.log("Plot: " + res.Plot);
			console.log("Actors: " + res.Actors);
			console.log("Rotten Tomatoes Link: " + res.tomatoURL);
		}
	});
}


