const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validate"); // import validate function
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");

// add a user to the database
authRouter.post("/signup", async (req, res) => {
  try {
    // validate the request body
    const { valid, error } = validateSignupData(req.body);

    if (!valid) {
      throw new Error(error);
    }

    const { firstName, lastName, email, password } = req.body;

    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user ie instance of User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 10 * 900000),
    });
    res.status(201).json({message : "Signed up successfully" , data : user});
  } catch (err) {
    res.status(400).send(err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    //Validate email
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    //Validate password
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 900000),
      });
      // Set user as online when they make a request
      user.isOnline = true;
      user.lastSeen = null; // Clear lastSeen while online
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout",userAuth, async (req, res) => {
  const user = req.user;
  user.isOnline = false;
  user.lastSeen = new Date(); // Set last seen to current time
  await user.save();
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
