const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const toUser = await User.findById(toUserId);
        if (!toUser){
            return res.status(404).send('User not found in database!');
        }
        const status = req.params.status;
        const connectionRequestInstance = new ConnectionRequest({
            fromUserId, toUserId, status
        });
        const isExistingConnection = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if (isExistingConnection){
            return res.status(400).send('Connection not allowed');
        }
        await connectionRequestInstance.save();
        res.status(201).json({message : `${loggedInUser.firstName} is ${status} in ${toUser.firstName}`, connectionRequestInstance});
    }catch(err){
        res.status(400).send(err.message);
    }

});

module.exports = requestRouter;