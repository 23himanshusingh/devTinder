const User = require("../models/user");
const jwt = require("jsonwebtoken");

// custom middleware to check if the user is authorized or not
const userAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token){
            return res.status(401).send("JWT expired");
        }
        const decodedMsg = await jwt.verify(token, "Mysecretkey");
        const user = await User.findById({ _id: decodedMsg._id });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Set user as online when they make a request
        user.isOnline = true;
        user.lastSeen = null; // Clear lastSeen while online

        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send(err.message + ", Please Authenticate");
    }
};

module.exports = userAuth;
