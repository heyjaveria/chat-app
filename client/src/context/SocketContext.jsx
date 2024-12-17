import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import io from 'socket.io-client';
const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children}) => {
    const socket = useRef();
    const {userInfo} = useAppStore();
console.log("this is user info",userInfo);
    useEffect ( () => {
        if (userInfo){
            socket.current = io(HOST,{   
                withCredentials : true,     
                 query : {userId: userInfo.id},
            });

            socket.current.on("connect" , (message) => {  
                console.log("Connected to Socket server.")
            });

            const handleReceiveMessage = (message) => {
                const {selectedChatData , selectedChatType , addMessage} = useAppStore.getState();
            
                if(
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || 
                        selectedChatData._id === message.recipient._id
                    )
                ){
                    console.log("message receive",message);
                    addMessage(message);
                }
             };

             socket.current.on("receiveMessage",handleReceiveMessage);
            //  socket.current.on("receiveMessage",(message)=>{
            //     handleReceiveMessage(message);
            //  }
            //  );
            return() => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userInfo, HOST, io]) 

    return (
         <SocketContext.Provider value= {socket.current}>
        {children}
        </SocketContext.Provider>
);

};

