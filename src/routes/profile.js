const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { valid, error } = validateEditProfileData(req.body);
        if (!valid) {
            throw new Error(error);
        }
        const receivedFields = Object.keys(req.body);
        receivedFields.forEach((field)=>{
            user[field] = req.body[field];
        });
        await user.save();
        res.json({message : `${user.firstName} profile is updated successfully!`, 
        data: user});
    }catch(err){
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const newPassword = req.body.password;

        // Check password strength
        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,         // Minimum 8 characters
            minLowercase: 1,      // At least 1 lowercase letter
            minUppercase: 1,      // At least 1 uppercase letter
            minNumbers: 1,        // At least 1 number
            minSymbols: 1         // At least 1 special character
        })) {
            return res.status(400).send("Password is not strong enough!");
        }

        const user = req.user;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user["password"] = hashedPassword;
        await user.save();
        res.send(`${user.firstName} has successfully changed their password!`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = profileRouter;