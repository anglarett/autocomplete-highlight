var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser')
const request = require('request');

// Replace with load your API keys
const config = require("./config.js");
const apiKeyAutoTranslate = config.apiKeyAutoTranslate; // Your_API_Key
const apiKeyPlacesDetails = config.apiKeyPlacesDetails; // Your_API_Key

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/index.html'));

});
app.use('/images', express.static(__dirname + '/www/images'));
app.use('/css', express.static(__dirname + '/www/css'));
app.use('/js', express.static(__dirname + '/www/js'));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())


