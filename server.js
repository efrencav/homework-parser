var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose"); //Mongoose ODM NPM package
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

//require the routes.js file and pass the router object as argument


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

require("./controllers/scrape.js")(app);
require("./controllers/headline.js")(app);
require("./controllers/note.js")(app);

// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main",
partialsDir: __dirname+ "/views/layouts/partials"
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI;

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_ld507b4d:8eqn3jlt1i780jojnfse8g0njr@ds115035.mlab.com:15035/heroku_ld507b4d');


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI || "mongodb://localhost/mongoNewsscraper" );


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  