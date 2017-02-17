/*

This controllers file serves to separate the logic from the routes within app.js 
 +    (app.js would get messy will all this stuff in there)
 +
 +    module.exports.<method name>
 +
 +    (You can use module.exports.<anything> - it can be a variable as well)
 +
 +    - Module.exports exposes the method name to the rest of the application
 +    (all app.js needs to do is require in this file and use that variable to access the below methods)
 +
 +    - Think like a "public method" in java
 +*/


// Require in our schema for our entry collection
var Entry = require('../models/entry.js');

// GET /new-entry
module.exports.loadNewEntry = function(request, response) {
    response.render("new-entry");
};

//POST /new-entry
module.exports.postNewEntry = function(request, response) {

    // Make sure a user submits a entry with a title and entryText
    if (!request.body.title || !request.body.entryText) {
            response.status(400).send("Entries must have a title and a body");
            return;
        }

        // Use request.body.(element name) to grab the values from the user submitted form
        // and create a newEntry using the Entry schema
        var newEntry = new Entry({
            title : request.body.title,
            entryText : request.body.entryText,
            published : formatDate(new Date()), // Pass in a "prettified" date string 
        });

        // Save the new entry to our database in mLab
        newEntry.save(function(err) {
        if (err) {
            console.log(err);
        } 
        });

        // Adds a new entry to the list of local entries
        entries.push({
            title: request.body.title,
            entryText: request.body.entryText,
            published: formatDate(new Date()),
            _id: newEntry._id // Pass in the unique id assigned to the entry to the local array (so we can edit/delete it later)
        });

        // Redirect to homepage to see new entry
        response.redirect("/");
};

// GET '/delete-entry/:entryId'
// /delete-entry/654654321
// /delete-entry/312315545353
module.exports.deleteEntry = function(request, response) {
    Entry
        .findByIdAndRemove(request.params.entryId) // Use request to grab the entryId value from the params
        .exec(
            function(err, entry) {
                if (err) {
                    console.log(err);
                }
            }
        );

         for (var index = 0; index < entries.length; index++) {
                    if (entries[index]._id == request.params.entryId) {
                        entries.splice(index, 1); // remove entry from local array
                    }
         }
            
        response.redirect("/");
};

// GET '/'
module.exports.loadIndex = function(request, response) {
    response.render("index.ejs");
};

// GET "/update-entry/:entryId"
module.exports.getEntryToUpdate = function(request, response) {
    Entry
        .findById(request.params.entryId)
        .exec(
            function(err, entryDetails) {
                if (err) {
                    console.log(err);
                }
                else {
                    response.render('update-entry.ejs', {      // Render the update-entry.ejs page 
                    title : entryDetails.title,              // pass in the current title/entryText of the entry
                    entryText : entryDetails.entryText
                    });
                }
            }
        );
}

// POST "/update-entry/:entryId"
// When user clicks 'update entry' 
module.exports.loadUpdatedEntry = function(request, response) {
    Entry.update({'_id' : request.params.entryId}, {  // Update entry in db
        'title' : request.body.title,      // Set the new title & entry text
        'entryText' : request.body.entryText
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            entries.forEach(function(entry) {                       // Update local entries array
                if (entry._id == request.params.entryId) {
                    entry.entryText = request.body.entryText; // Set the new title & entry text      
                    entry.title = request.body.title;
                }
            })
            
        }
        response.redirect('/');
    });
};

// Function to return an array of past entries
module.exports.loadEntries = function(entries) {
    Entry.find({  
            }, function(err, entry) {
                if (err) {
                    console.log(err);    
                }
                entry.forEach(function(entry) {
                    entries.push({
                        title: entry.title,
                        entryText: entry.entryText,
                        published: entry.published,
                        _id: entry._id
                    })   
                });
            });
            return entries;
};

// Function to "prettify" the date displayed on the home page
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


