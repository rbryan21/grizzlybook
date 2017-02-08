var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var Message = require('./models/message.js');

// Make an express app
var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Creates a global array to store all your entries
entries = [];
// Makes this entries array available in all views
app.locals.entries = entries;


// Uses Morgan to log every request
app.use(logger("dev"));

// Populates a variable called req.body if the user is submitting a
// form (The extended option is required.)
app.use(bodyParser.urlencoded({ extended: false}));

var newEntryCtrl = require('./controllers/new-entry.js');

// When visiting the site root, renders the homepage (at views/index.ejs)
app.get("/", newEntryCtrl.loadIndex);

// Renders the "new entry" page (at views/index.ejs) when GETing the URL
app.get("/new-entry", newEntryCtrl.loadNewEntry);

app.delete("/new-entry", newEntryCtrl.deleteEntry);

app.get("/update-entry/:messageId", newEntryCtrl.getEntryToUpdate);
app.post("/update-entry/:messageId", newEntryCtrl.postEntry);

app.post("/new-entry", newEntryCtrl.postNewEntry);

// Renders a 404 page because you're requesting an unknown source
app.use(function(request, response) {
    response.status(404).render("404");
})

// Start server on port 3000
http.createServer(app).listen(3000, function() {
    console.log("Guestbook app started on port 3000.");
    loadMessages();
})


function loadMessages() {
     Message.find({  
        }, function(err, message) {
            if (err) {
                console.log(err);    
            }
            message.forEach(function(message) {
                entries.push({
                    title: message.title,
                    content: message.entryText,
                    published: message.published,
                    _id: message._id
                })   
            });
        });
        console.log(entries);
}