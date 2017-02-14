var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var port_number = process.env.PORT || 3000;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var Message = require('./models/message.js');

// Make an express app
var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Creates a global array to store all your entries
entries = loadMessages();
// Makes this entries array available in all views
app.locals.entries = entries;

// Uses Morgan to log every request
app.use(logger("dev"));

// Populates a variable called req.body if the user is submitting a
// form (The extended option is required.)
app.use(bodyParser.urlencoded({ extended: false}));

var entryCtrl = require('./controllers/entries.js');

// When visiting the site root, renders the homepage (at views/index.ejs)
app.get("/", entryCtrl.loadIndex);

// Renders the "new entry" page (at views/index.ejs) when GETing the URL
app.get("/new-entry", entryCtrl.loadNewEntry);

app.get("/update-entry/delete/:messageId", entryCtrl.deleteEntry);

app.get("/update-entry/:messageId", entryCtrl.getEntryToUpdate);
app.post("/update-entry/:messageId", entryCtrl.postEntry);

app.post("/new-entry", entryCtrl.postNewEntry);

// var app = angular.module('testApp', []);

// Renders a 404 page because you're requesting an unknown source
app.use(function(request, response) {
    response.status(404).render("404");
})

// Start server on port 3000
app.listen(port_number);
    console.log("Grizzly book started on port " + port_number);


function loadMessages() {
    entries = [];
     Message.find({  
        }, function(err, message) {
            if (err) {
                console.log(err);    
            }
            message.forEach(function(message) {
                entries.push({
                    title: message.title,
                    entryText: message.entryText,
                    published: message.published,
                    _id: message._id
                })   
            });
        });
        return entries;
}