/*
    This file utilizes mongoose to create a schema for our Entries collection in our mLab database

    - MongoDB documents do not have a predefined structure (you can enter whatever you what in each collection)
        - But mongoose can provide a consistent structure for you to follow with new documents
        - It allows provides other neat features like the connect method
*/


// Require in mongoose
var mongoose = require('mongoose');

// Use mongoose to create a schema for our entries
var entrySchema = mongoose.Schema({
   title: {
       type: "String",
       required: true
   },
   entryText: {
       type: "String",
       required: true
   },
   published: {
       type: "String",
       requred: true
   },
   date: {
       type: Date,
       default: Date.now()
   }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Entry', entrySchema);
