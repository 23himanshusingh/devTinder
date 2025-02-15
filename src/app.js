const express = require('express');

const app = express(); // create express app

// order of routes matter
// request handlers

app.use("/user", (req, res) => {
    res.send('app.use');
});


app.get("/user", (req, res) => {
    res.send('Get user data');
});

app.post("/user", (req, res) => {
    res.send('Send user data');
});

app.delete("/user", (req, res) => {
    res.send('Delete user data');
});

app.patch("/user", (req, res) => {
    res.send('Patch user data');
});

app.put("/user", (req, res) => {
    res.send('Put user data');
});

app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests


