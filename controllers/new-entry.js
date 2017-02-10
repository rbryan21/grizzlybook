var Message = require('../models/message.js');

// GET /new-entry
module.exports.loadNewEntry = function(request, response) {
    response.render("new-entry");
};

//POST /new-entry
module.exports.postNewEntry = function(request, response) {
    if (!request.body.title || !request.body.entryText) {
            response.status(400).send("Entries must have a title and a body");
            return;
        }

        var newMessage = new Message({
            title : request.body.title,
            entryText : request.body.entryText,
            published : formatDate(new Date()), 
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
            entryText: request.body.entryText,
            published: formatDate(new Date()),
            _id: newMessage._id
        });

        console.log(newMessage._id);
        // Redirect to homepage to see new entry
        response.redirect("/");
};

module.exports.deleteEntry = function(request, response) {
    Message
        .findByIdAndRemove(request.params.messageId)
        .exec(
            function(err, message) {
                if (err) {
                    console.log(err);
                }
            }
        );

         for (var index = 0; index < entries.length; index++) {
                    if (entries[index]._id == request.params.messageId) {
                        entries.splice(index, 1); // remove message
                    }
                }
            
              
        response.redirect("/");
};

module.exports.loadIndex = function(request, response) {
    response.render("index.ejs");
};

module.exports.getEntryToUpdate = function(request, response) {
    console.log(request.params.messageId);
    Message
        .findById(request.params.messageId)
        .exec(
            function(err, messageDetails) {
                if (err) {
                    console.log(err);
                }
                else {
                    response.render('update-entry.ejs', {
                    title : messageDetails.title,
                    entryText : messageDetails.entryText
                    });
                }
            }
        );
}

module.exports.postEntry = function(request, response) {
    Message.update({'_id' : request.params.messageId}, {
        'title' : request.body.title,
        'entryText' : request.body.entryText
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            entries.forEach(function(entry) {
                // console.log('Entry._id = ',entry._id);
                // console.log('request.params.messageId = ', request.params.messageId);
                // console.log('/n');
                if (entry._id == request.params.messageId) {
                    // console.log('hi');
                    entry.entryText = request.body.entryText;
                    entry.title = request.body.title;
                }
            })
            response.redirect('/');
        }
    });
};

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


