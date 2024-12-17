import {Server as SocketIOServer} from 'socket.io'; 
import Message from "./models/MessagesModel.js"

const setupSocket = (server) => {
    const io = new SocketIOServer ( server, {
        cors: {
            origin: process.env.ORIGIN,
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
};

    const sendMessage = async(message) => {
        console.log("sendMessage event received with data:", message);
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
      console.log("recipiemt id" , recipientSocketId);
      console.log("sender id" , senderSocketId);
        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
        .populate("sender","id email firstName lastName image color")
        .populate("recipient","id email firstName lastName image color");
    
        if (recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage",messageData);
        }
        if (senderSocketId){
            io.to(senderSocketId).emit("receiveMessage",messageData);
        }
    
    };  

    io.on ("connection", (socket) =>{
        console.log("socket connected", socket.id)
        const userId = socket.handshake.query.userId;
        if (userId) {
            console.log(`User ID: ${userId} connected with Socket ID: ${socket.id}`);
        } else {
            console.warn("No userId provided during socket connection.");
        }
        console.log(`Connection query:`, socket.handshake.query);
        console.log(`Connection headers:`, socket.handshake.headers);
        if(userId){
            userSocketMap.set(userId , socket.id);
            console.log(`User connected : ${userId} with Socket Id : ${socket.id}`);
        } else {
            console.log("User Id not provided during connection.");
        }
        socket.on("sendMessage" , sendMessage )
        // socket.on("sendMessage",(message)=>{
        //     sendMessage(message);
        //  }
        //  );
        socket.on("disconnect",()=>disconnect(socket))
    });

 
  

  
} 

export default setupSocket;