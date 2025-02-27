const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join('$'))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    });
    io.on("connection", (socket) => {
        //handle events
        socket.on("joinChat", ({firstName,userId,targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " joined Room : " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({firstName, lastName,userId, targetUserId,text}) => {
            //Save messages to the database
            try{
                const roomId = getSecretRoomId(userId, targetUserId);
                const isConnection = await ConnectionRequest.findOne({
                    $or : [
                        {fromUserId :userId, toUserId :targetUserId, status: "accepted"},
                        {fromUserId :targetUserId, toUserId :userId, status: "accepted"},
                    ]
                });
                if (!isConnection) return res.status(401).send(
                    "Requested target user id not in connections"
                );
                let chat = await Chat.findOne({
                    participants: {$all : [userId, targetUserId]},
                });
                if (!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });
                await chat.save();
                io.to(roomId).emit("messageReceived",{
                    firstName,lastName,text
                });
            }catch(err){
                res.send(err);
            }
        });
        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;