const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const validateSignupData = require("../utils/validate"); // import validate function
const bcrypt = require("bcrypt");

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
      res.send("Logged in successfully");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
