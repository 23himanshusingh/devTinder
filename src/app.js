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

// Middleware to validate allowed fields for signup
const validateSignupFields = (req, res, next) => {
    const ALLOWED_FIELDS = ['firstName', 'lastName', 'email', 'password', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const receivedFields = Object.keys(req.body);
    const isValidOperation = receivedFields.every((field) => ALLOWED_FIELDS.includes(field));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid fields in signup request' });
    }

    next();
};

// add a user to the database
app.post('/signup', validateSignupFields,  async (req, res) => {
    try{
        const user = new User(req.body);
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

// get all users in the collection
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
app.delete('/user', async (req, res) => {
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



app.patch('/user/:id', async (req, res) => {
    // const email = req.body.email;
    const obj = req.body;
    const id = req.params?.id;
    try {
        // const user = await User.findOneAndUpdate({email : email}, obj);
        const ALLOWED_UPDATES = ['password','age','gender','photoUrl','about','skills'];
        const isUpdateAllowed = Object.keys(obj).every((update) => ALLOWED_UPDATES.includes(update));
        if (!isUpdateAllowed){
            throw new Error("Invalid updates");
        }
        const user = await User.findByIdAndUpdate({_id : id}, obj, {runValidators:true});
        if (!user){
            res.status(404).send("User not found");
        }else{
            res.send("User updated");
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});








