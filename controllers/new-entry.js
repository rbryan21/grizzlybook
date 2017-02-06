var Message = require('../models/message.js');

// GET /new-entry
module.exports.loadNewEntry = function(request, response) {
    response.render("new-entry");
};

//POST /new-entry
module.exports.postNewEntry = function(request, response) {
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
};

module.exports.deleteEntry = function(request, response) {

};

module.exports.editEntry = function(request, response) {

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
