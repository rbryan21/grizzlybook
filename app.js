
// Require in every module we need
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

/* Set the port number
 If Heroku is launching this app - use heroku's port number 
 else launch it locally on port 3000

 local launch url: localhost:3000
 heroku launch url: https://grizzlybook.herokuapp.com/
*/
var port_number = process.env.PORT || 3000;

// Require in the mLab database config file
var configDB = require('./config/database.js');
// Connect to that URL with mongoose
mongoose.connect(configDB.url);

// Make an express app
var app = express(); 


// When we call res.render(), express will look in our views folder for the file
// It creates the relative path for us
app.set("views", path.resolve(__dirname, "views"));

// At runtime loads the ejs module letting us utilize it for our static web pages
app.set("view engine", "ejs");

// Uses Morgan to log every request to our web page
// GET / 304 10.775 ms - -
// type of http request / status code response time
app.use(logger("dev"));

// Populates a variable called req.body if the user is submitting a
// form (The extended option is required.)
app.use(bodyParser.urlencoded({ extended: false}));

var entryCtrl = require('./controllers/entries.js');

// Load up the past messages into a local entries array 
entries = entryCtrl.loadEntries([]);
// Allow entries to be accessible in our views
app.locals.entries = entries;

/*
    Routes

    app.typeOfHttpRequest(URL, what you want to do);
*/
app.get("/", entryCtrl.loadIndex); 
app.get("/new-entry", entryCtrl.loadNewEntry);
/* 

  /delete-entry/24234242434234234 
  /delete-entry/23424
  /delete-entry/<anything>
 
  /delete-entry/<this entry's id> <-- we can then access that id and delete it
*/ 
app.get("/delete-entry/:entryId", entryCtrl.deleteEntry);
app.get("/update-entry/:entryId", entryCtrl.getEntryToUpdate);
app.post("/update-entry/:entryId", entryCtrl.loadUpdatedEntry);
app.post("/new-entry", entryCtrl.postNewEntry);

/* 
   Starts web server with port number defined above

   local start will listen on port number 3000 
   (at localhost:3000/ in the browser)

   Heroku start will listen at https://grizzlybook.herokuapp.com/

*/ 
app.listen(port_number);
    console.log("Grizzly book started on port " + port_number);