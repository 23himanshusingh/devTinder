const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin: "http://localhost:5173",
        }
    });
    io.on("connection",(socket)=>{
        //handle events
        socket.on("joinChat",({firstName,userId,
            targetUserId
        }) => {
            const roomId = [userId,targetUserId].sort().join("_");
            console.log(firstName+" joined Room : " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage",()=>{});
        socket.on("disconnect",()=>{});
    });
};

module.exports = initializeSocket;