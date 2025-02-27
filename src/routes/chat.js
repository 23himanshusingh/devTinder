const express = require("express");
const  userAuth  = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  

  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    if (targetUserId === userId.toString()) {
        return res.status(404).send("Chat with yourself not allowed");
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    // const targetUser = await User.findById(targetUserId).select("firstName lastName");
    // if (!targetUser){
    //     res.status(404).send("Requested user not found");
    // }

    // Fetch target user's status
    const targetUser = await User.findById(targetUserId).select("isOnline lastSeen firstName lastName");
    const response = {
      chat,
      targetUserStatus: {
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        isOnline: targetUser.isOnline,
        lastSeen: targetUser.isOnline ? null : targetUser.lastSeen,
      },
    };

    res.json(response);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;