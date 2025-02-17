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

app.use(express.json()); // parse JSON bodies

// add a user to the database
app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);
    }catch(err){
        res.status(400).send(err);
    }
});

// get users by their email id
app.get('/user', async (req, res) => {
    try{
        const user = await User.find({email: req.body.email});
        if (user.length === 0){
            return res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send(err);
    }
});

// get all users
app.get('/users', async (req,res) => {
    try{
        const users = await User.find({});
        if (users.length === 0){
            return res.status(404).send("No users found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send(err);
    }
});

// delete a user by their id
app.delete('/delete', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete({_id: req.body.id});
        if (!user){
            return res.status(404).send("User not found");
        }else{
            res.send("User deleted");
        }
    }catch(err){
        res.status(400).send(err);
    }
});

app.patch('/update', async (req, res) => {
    const email = req.body.email;
    const obj = {firstName : req.body.firstName, age : req.body.age};
    try {
        const user = await User.findOneAndUpdate({email : email}, obj);
        if (!user){
            return res.status(404).send("User not found");
        }else{
            res.send("User updated");
            console.log(user);
        }
    }catch(err){
        res.status(400).send(err);
    }
});








