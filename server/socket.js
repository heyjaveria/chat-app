import {Server as SocketIOServer} from 'socket.io'; 
import Message from "./models/MessagesModel.js"

const setupSocket = (server) => {
    const io = new SocketIOServer ( server, {
        cors: {
            origin: process.env.ORIGIN || "http://localhost:3000",
            methods :["GET", "POST" ],
            credentials : true,
        }                                                                                            ,
});

    const userSocketMap = new Map();

    const disconnect = (socket) =>{
        console.log (`Client Disconected: ${socket.id}`)

        for ( const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
        }
    }
    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
    
        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
        .populate("sender","id email firstName lastName image color")
        .populate("recipient","id email firstName lastName image color");
    
        if (recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage",messageData);
        }
        if (senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData);
        }
    
    };  

    io.on ("connection", (socket) =>{
        const userId = socket.handshake.query.userId;
        console.log(`Connection query:`, socket.handshake.query);
        console.log(`Connection headers:`, socket.handshake.headers);
        if(userId){
            userSocketMap.set(userId , socket.id);
            console.log(`User connected : ${userId} with Socket Id : ${socket.id}`);
        } else {
            console.log("User Id not provided during connection.");
        }
        socket.on("sendMessage" , sendMessage )
        socket.on("disconnect",()=>disconnect(socket))
    });

};



}

export default setupSocket;