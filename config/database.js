/*
    This file provides the URL for mongoose to connect to in app.js

     - When you create a database within mLab you'll see a connection string like below
     - You must create a user within mLab and replace the username and password tags below
     - Make sure to give the user read & write access

    mongodb://<user>:<password>@ds139619.mlab.com:39619/grizzlybook
*/
module.exports = {
    url : 'mongodb://admin:admin@ds139619.mlab.com:39619/grizzlybook'
};
