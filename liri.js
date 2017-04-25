var fs = require("fs");
var request = require("request");
var spotify = require("spotify");
var twitter = require("twitter");
var myKeys = require("./keys.js");
var twitterClient = new twitter(myKeys.twitterKeys);
var firstInput = process.argv[2];
var allInputs = process.argv;
var title = "";
//The following lOne etc. variables were made to assist in appending the data responses to the log.txt. These variables allow me to use the response data without having to type the JSON .notation every time.
var lOne = "";
var lTwo = "";
var lThree = "";
var lFour = "";
var lFive = "";
var lSix = "";
var lSeven = "";
var lEight = "";
var b = "\n";

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
		break;

	case "do-what-it-says":
		fs.readFile("random.txt", "utf8", function(err, data) {
			var dataArray = data.split(",");
			firstInput = dataArray[0];
			allInputs = dataArray[1].replace(/"/g, "").split(" ");
			allInputs.unshift("", "", "");
			plusConcat(allInputs);
		});
		break;
}

function plusConcat() {
	for (var i = 3; i < allInputs.length; i++) {
		if (i > 3 && i < allInputs.length) {
			title = title + "+" + allInputs[i];
		} else {
			title = allInputs[i];
		}
	}

	if (firstInput === "spotify-this-song") {
		song(title);
	} else {
		movie(title);
	}
}

function tweets() {
	//I could have written a bunch of tweets, but I decided to post someone else's since they're more interesting.
	twitterClient.get("statuses/user_timeline", { screen_name: "StephenAtHome", count: "20" }, function(err, tweets, response) {
	 	if (!err) {
		 	for (var i = 0; i < 20; i++) {
		 		console.log("TWEET #" + (i + 1) + " - " + tweets[i].text + " CREATED: " + tweets[i].created_at);

		 		fs.appendFile("log.txt", firstInput + " result #" + (i + 1) + b + "TWEET #" + (i + 1) + " - " + tweets[i].text + " CREATED: " + tweets[i].created_at + b + b, function(err) {
					if (err) {
						console.log(err);
					}
				});
		 	}
		} else {
			console.log(err);
		}
	});
}

function ace() {
	spotify.search({ type: "track", query: "The+Sign" }, function(err, data) {
		if (!err) {
			var res = data.tracks.items[3];
			lOne = "Artist(s): " + res.album.artists[0].name;
			lTwo = "Song title: " + res.name;
			lThree = "Album title: " + res.album.name;
			lFour = "Link to preview at Spotify: " + res.preview_url;

			console.log(lOne);
			console.log(lTwo);
			console.log(lThree);
			console.log(lFour);

			fs.appendFile("log.txt", firstInput + " 'The Sign'" + b + lOne + b + lTwo + b + lThree + b + lFour + b + b, function(err) {
				if (!err) {
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}

function song(input) {
	spotify.search({ type: "track", query: input }, function(err, data) {
		if (!err) {
			//returning the first three related songs in the array because the user might not know the exact song title, and this will give options
			for (var i = 0; i < 3; i++) {
				var res = data.tracks.items[i];
				lOne = "Artist(s): " + res.album.artists[0].name;
				lTwo = "Song title: " + res.name;
				lThree = "Album title: " + res.album.name;
				lFour = "Link to preview at Spotify: " + res.preview_url;
				console.log(lOne);
				console.log(lTwo);
				console.log(lThree);
				console.log(lFour);

				//I tried using title.replace(/+/g, " ") below, but I kept getting an error. It seems the replace method doesn't like a plus sign even if there is one in the string.
				fs.appendFile("log.txt", firstInput + " " + title + " result #" + (i + 1) + b + lOne + b + lTwo + b + lThree + b + lFour + b + b, function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		} else {
			console.log(err);
		}
	});
}

function movie(input) {
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json&tomatoes=true";
	request(queryUrl, function(err, response, body) {
		//I decided to stick to returning one movie since the user is more likely to know the movie title
		if (!err && response.statusCode === 200) {
			var res = JSON.parse(body);
			lOne = "Title: " + res.Title;
			lTwo = "Year: " + res.Year;
			lThree = "IMDB Rating: " + res.imdbRating;
			lFour = "Country or Countries of Production: " + res.Country;
			lFive = "Language(s): " + res.Language;
			lSix = "Plot: " + res.Plot;
			lSeven = "Actors: " + res.Actors;
			lEight = "Rotten Tomatoes Link: " + res.tomatoURL;

			console.log(lOne);
			console.log(lTwo);
			console.log(lThree);
			console.log(lFour);
			console.log(lFive);
			console.log(lSix);
			console.log(lSeven);
			console.log(lEight);

			fs.appendFile("log.txt", firstInput + " " + title + b + lOne + b + lTwo + b + lThree + b + lFour + b + b, function(err) {
				if (err) {
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}