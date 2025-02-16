const express = require('express');

const app = express(); // create express app

const {adminAuth, userAuth} = require('./middlewares/auth');

// order of routes matter
// request handlers

app.post("/user/login", (req, res) => {
    res.send('User login');
});

app.use("/admin", adminAuth); // middleware for admin authentication

app.get("/admin/getAllData", (req, res) => {
    res.send('Get all data');
});

app.get("/admin/deleteUser", (req, res) => {
    res.send('Delete user');
});


app.get("/user", userAuth, (req, res) => {
    try {
        throw new Error('User data error');
        res.send('User data');
    }catch (err){
        res.status(500).send('Something broke!');
    }
});

app.use("/", (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Wrong!');
});

//error handling middleware





app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests


