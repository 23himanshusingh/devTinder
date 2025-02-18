const express = require("express");
const app = express(); // create express app
const connectDB = require("./config/database"); // import database connection
const User = require("./models/user"); // import user model
const validateSignupData = require("./utils/validate"); // import validate function
const bcrypt = require("bcrypt");


connectDB()
  .then(() => {
    console.log("Connected to MongoDB"); // if connection is successful
    app.listen(3000, () => {
      console.log("Listening on PORT 3000");
    }); // listen for incoming requests
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json()); // parse JSON bodies



// add a user to the database
app.post("/signup", async (req, res) => {
  try {
    // validate the request body
    const { valid, error } = validateSignupData(req.body);

    if (!valid) {
      throw new Error(error);
    }

    const { firstName, lastName, email, password } = req.body;

    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10); 

    console.log(hashedPassword);

    // create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get users by their email id
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all users in the collection
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete a user by their id
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.body.id });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch("/user/:id", async (req, res) => {
  // const email = req.body.email;
  const obj = req.body;
  const id = req.params?.id;
  try {
    // const user = await User.findOneAndUpdate({email : email}, obj);
    const ALLOWED_UPDATES = [
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(obj).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates");
    }
    const user = await User.findByIdAndUpdate({ _id: id }, obj, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
