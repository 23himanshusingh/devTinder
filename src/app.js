const express = require('express');

const app = express(); // create express app

// order of routes matter
// request handlers


app.get("/user", 
[(req, res, next) => {
    next();
    console.log('Route Handler 1');
    // res.send('Response from route handler 1');
},
(req, res, next) => {
    // res.send('Response from route handler 2');
    console.log('Route Handler 2');
    next();
}],
[(req, res, next) => {
    console.log('Route Handler 3');
    next();
    // res.send('Response from route handler 3');
}]

);


// app.get("/user", (req, res) => {
//     res.send('Get user data');
// });

// app.post("/user", (req, res) => {
//     res.send('Send user data');
// });

// app.delete("/user", (req, res) => {
//     res.send('Delete user data');
// });

// app.patch("/user", (req, res) => {
//     res.send('Patch user data');
// });

// app.put("/user", (req, res) => {
//     res.send('Put user data');
// });

app.listen(3000, () => {console.log("Listening on PORT 3000")}); // listen for incoming requests


