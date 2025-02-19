const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");

requestRouter.post("/sendConnectionReq", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + " has sent a connection request");
    }catch(err){
        res.send(err.message);
    }

});

module.exports = requestRouter;