'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', function (req, res) {

    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    let reqUrl = encodeURI('http://www.omdbapi.com/?apikey=8863ef22&t=' + movieToSearch);
    http.get(reqUrl, (responseFromAPI) => {

    	let body = "";
    	responseFromAPI.on("data", data => {
    	    body += data;
    	});
        responseFromAPI.on('end', () => {
            let movie = JSON.parse(body);
            let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
            dataToSend += movie.Title + ' is an ' +movie.Genre + ' movie, released in ' + movie.Year + '. It was directed by ' + movie.Director;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.listen((process.env.PORT || 8081), function () {
    console.log("Server is up and running...");
});