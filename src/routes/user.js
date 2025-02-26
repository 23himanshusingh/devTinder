const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
const SELECT_FIELDS = "firstName lastName gender age about skills photoUrl";

// GET all received connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",SELECT_FIELDS);
        res.status(200).json({message:'Received connection requests fetched successfully!',
            data: connectionRequests
        });
    }catch(err){
        res.status(404).send(err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id, status : 'accepted'},
                {toUserId : loggedInUser._id, status : 'accepted'}
            ]
        }).populate("fromUserId",SELECT_FIELDS)
        .populate("toUserId",SELECT_FIELDS);
        
        const connections = connectionRequest.map((conn) =>{
            if (conn.fromUserId._id.toString() === loggedInUser._id.toString()){
                return conn.toUserId;
            }
            return conn.fromUserId;
        });
        res.status(200).json({message : "Connections fetched successfully!",data : connections});
    }catch(err){
        res.status(404).send(err.message);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 20;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;
        // get users which have (send or received) request from the loggedInUser
        const connectionRequests = await ConnectionRequest.find({
            $or :[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((conn) => {
            hideUsersFromFeed.add(conn.fromUserId.toString());
            hideUsersFromFeed.add(conn.toUserId.toString());
        });

        const FeedProfiles = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id.toString()}}
            ]
        }).select(SELECT_FIELDS).skip(skip).limit(limit);


        res.status(200).send(FeedProfiles);
    }catch(err){
        res.status(404).send(err.message);
    }
});

module.exports = userRouter;