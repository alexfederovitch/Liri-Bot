const dotenv = require("dotenv").config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

let input = process.argv[2];
let selection = process.argv[3];



let params = {
    screen_name: 'AFederovitch',
    count: 20
};

switch (input) {
    case `my-tweets`:
    myTweets();
    break;
}
switch (input) {
    case `spotify-this-song`:
    music();
    break;
}
switch (input) {
    case `movie-this`:
    movieSearch();
    break;
}
switch (input) {
    case `do-what-it-says`:
    doWhatItSays();
    break;
}

function myTweets () {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log('MY MOST RECENT TWEETS: ')
            let a = '';
          for (let i = 0; i < tweets.length; i++) {
              a += `${tweets[i].text}\n`;
          } 
            console.log(a);
            fs.appendFile('log.txt', `My most recent Tweets:\n ${a} \n`, function (err) {
                if (err) throw err;
                console.log("log.txt saved");
            });
        } else {
            console.log('There was an error!');
        }
      });
};

function music() {
    if (!selection) {
        selection = 'The Sign';
    } {
        spotify.search({ type: 'track', query: selection }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err)
            } else {
                let song = data.tracks;
                let a = `Artist:  ${song.items[0].artists[0].name} \n`
                a += `Song name:  ${song.items[0].name} \n`
                a += `Preview the song:  ${song.items[0].preview_url} \n`
                a += `Album:  ${song.items[0].album.name}\n`
                console.log(a);
                fs.appendFile('log.txt',`I Spotified this song:\n ${a}\n`, function (err) {
                    if (err) throw err;
                    console.log("log.txt saved");
                });
            }
        })
    }
};

function movieSearch() {
    if (!selection) {
        selection = "Mr. Nobody."
        console.log("If you havne't watched 'Mr. Nobody', then you should.  It's on Netflix!")
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + selection + "&tomatoes=true&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            let a = `The movie's title is: ${JSON.parse(body).Title} \n`
            a += `${JSON.parse(body).Title} came out in ${JSON.parse(body).Year}\n`
            a += `The IMDB rating for ${JSON.parse(body).Title} is ${JSON.parse(body).imdbRating}\n`
            a += `The Rotten Tomatoes rating for ${JSON.parse(body).Title} is ${JSON.parse(body).Ratings[1].Value}\n`
            a += `${JSON.parse(body).Title} was made in ${JSON.parse(body).Country}\n`
            a += `${JSON.parse(body).Language} is spoken in ${JSON.parse(body).Title}\n`
            a += `The plot is ${JSON.parse(body).Plot}\n`
            a += `The principal actors in ${JSON.parse(body).Title} are: ${JSON.parse(body).Actors}.\n`
            console.log(a);
            fs.appendFile('log.txt',`I looked up this movie:\n ${a}\n`, function (err) {
                if (err) throw err;
                console.log("log.txt saved");
            });
        } 

    });
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            let txt = data.split(',');
            selection = txt[1];
            music(selection);
        }
    });
}


