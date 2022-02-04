require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(err => console.error(err))


// Our routes go here:
// Home Page
app.get('/', (req, res) => res.render('index'))

// Search Artist
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)  
        .then(data => res.render('artists', { artists: data.body.artists.items }))
        .catch(err => console.error(err))
})

// Albums
app.get('/albums/:id', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => res.render('albums', { albums: data.body.items }))
        .catch(err => console.error(err))
})

// Tracks
app.get('/tracks/:id', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => res.render('tracks', { tracks: data.body.items }))
        .catch(err => console.error(err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
