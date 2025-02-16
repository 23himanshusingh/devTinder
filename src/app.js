const express = require('express');

const app = express(); // create express app

const connectDB = require('./config/database'); // import database connection

connectDB().
then(() => {
    console.log("Connected to MongoDB"); // if connection is successful
    app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests
}).
catch((err) => {
    console.log(err);
});








