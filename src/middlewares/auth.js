const User = require("../models/user");
const jwt = require("jsonwebtoken");

// custom middleware to check if the user is authorized or not
const userAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token){
            throw new Error("JWT expired");
        }
        const decodedMsg = await jwt.verify(token, "Mysecretkey");
        const user = await User.findById({ _id: decodedMsg._id });
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = userAuth;
