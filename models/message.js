var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
   title: {
       type: "String",
       required: true
   },
   entryText: {
       type: "String",
       required: true
   },
   date: {
       type: Date, 
       default: Date.now
   }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
