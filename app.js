var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// Make an express app
var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// Creates a global array to store all your entries
var entries = [];
// Makes this entries array available in all views
app.locals.entries = entries;

var Message = require('./models/message.js');

// Uses Morgan to log every request
app.use(logger("dev"));

// Populates a variable called req.body if the user is submitting a
// form (The extended option is required.)
app.use(bodyParser.urlencoded({ extended: false}));

function loadPastMessages() {
   
     Message.find({  
        }, function(err, message) {
            if (err) {
                console.log(err);    
            }
            message.forEach(function(message) {
                entries.push({
                    title: message.title,
                    content: message.entryText,
                    published: message.published
                })   
            });
        });
}

function formatDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = month + '/' + day + '/' + year + " " + hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// When visiting the site root, renders the homepage (at views/index.ejs)
app.get("/", function(request, response) {
    
    response.render("index");
});

// Renders the "new entry" page (at views/index.ejs) when GETing the URL
app.get("/new-entry", function(request, response) {
    response.render("new-entry");
});

app.post("/new-entry", function(request, response) {
    // If a user submits the form with no title or content,
    // respond with a 400 error
    if (!request.body.title || !request.body.body) {
        response.status(400).send("Entries must have a title and a body");
        return;
    }

    var newMessage = new Message({
        title : request.body.title,
        entryText : request.body.body,
        published : formatDate(new Date())
    });

    newMessage.save(function(err) {
      if (err) {
        console.log(err);
      } else {
      }
    });

    // Adds a new entry to the list of entries
    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: formatDate(new Date())
    });
    console.log(newMessage._id);
    // Redirect to homepage to see new entry
    response.redirect("/");
});

// Renders a 404 page because you're requesting an unknown source
app.use(function(request, response) {
    response.status(404).render("404");
})

// Start server on port 3000
http.createServer(app).listen(3000, function() {
    console.log("Guestbook app started on port 3000.");
    loadPastMessages();
})