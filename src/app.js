const express = require('express');

const app = express(); // create express app

app.get("/", (req, res) => {
    res.send('Hello from server!');
}); // callback function is request handler

app.get("/test", (req, res) => {
    res.send('Hello from test server!');
});

app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests

