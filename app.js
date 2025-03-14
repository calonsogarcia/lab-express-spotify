require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get("/", (request, response, next) => {
  response.render("home")
})

app.get("/artist-search", (request, response, next) => {
  spotifyApi
  .searchArtists(request.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist-search-results", {artist: data.body.artists.items});
    })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (request, response, next) => {
  spotifyApi
  .getArtistAlbums(request.params.artistId)
  .then(data => {
      console.log('Artist albums:', data.body);
      response.render ("albums", {albums: data.body.items})
    })
  .catch(err => console.log("The error while searching the artists' albums:", err));
})

app.get("/tracks/:albumtId", (request, response, next) => {
  spotifyApi
  .getAlbumTracks(request.params.albumtId)
  .then((data) => {
    console.log('This are the tracks in the album', data.body);
    response.render("tracks", {tracks: data.body.items})
  })
  .catch(err => {
    console.log('Something went wrong!', err);
  });
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
