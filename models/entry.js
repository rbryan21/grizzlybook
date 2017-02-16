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
       required: true
   },
   date: {
       type: Date,
       default: Date.now()
   }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Entry', entrySchema);
