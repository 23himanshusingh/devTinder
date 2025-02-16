const express = require('express');
const app = express(); // create express app
const connectDB = require('./config/database'); // import database connection
const User = require('./models/user'); // import user model

connectDB().
then(() => {
    console.log("Connected to MongoDB"); // if connection is successful
    app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests
}).
catch((err) => {
    console.log(err);
});


app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Virat",
        lastName: "Kohli",
        email: "virat18@123",
        password: "virat@123",
        age: "32",
    });
    try{
        await user.save();
        res.status(201).send(user);
    }catch(err){
        res.status(400).send(err);
    }
});








