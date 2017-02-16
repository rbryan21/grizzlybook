var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var port_number = process.env.PORT || 3000;



var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// Make an express app
var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//Used to render static content in the application
app.use(express.static(__dirname + "/public"));
app.use('/scripts', express.static(__dirname + '/public'));


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
        entryText : request.body.body
    });

    newMessage.save(function(err) {
      if (err) {
        console.log(err);
      } else {
      }
    });

/*
 var query = {}; // select all docs
  var collection = db.collection('demo');
  var cursor = collection.find(query);
*/
    
    Message.find({
       
    }, function(err, message) {
        if (err) throw err;
        console.log(message);
    });

    // mongoose.Message.find({}).forEach(function(err, doc) {
    //     if (!err) {
    //         console.log(doc.title);
    //     } else {
    //         throw err;
    //     }
    // });

    /*


    db.collection.find(query).forEach(function(err, doc) {
  // handle
});
SiteModel.find({}, function(err, docs) {
    if (!err){ 
        console.log(docs);
        process.exit();
    } else {throw err;}
});

data.forEach(function(record){
    console.log(record.name);
    // Do whatever processing you want
});

Model.find().each(doc => {
  console.log(doc) // loop using curosr
}).then(res => {
  console.log('Results count:', res.count);
})


    */

    // Adds a new entry to the list of entries
    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: new Date()
    });
    // Redirect to homepage to see new entry
    response.redirect("/");
});

// Renders a 404 page because you're requesting an unknown source
app.use(function(request, response) {
    response.status(404).render("404");
})

// Start server on port 3000
http.createServer(app).listen(port_number, function() {
    console.log("Guestbook app started on port 3000.");
})