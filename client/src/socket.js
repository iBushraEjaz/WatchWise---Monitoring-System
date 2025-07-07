import { io } from "socket.io-client";

 const socket = io.connect('http://localhost:5000', {
//     reconnection: true,       // Enable auto-reconnection
//     reconnectionAttempts: 5,  // Number of reconnection attempts
//     reconnectionDelay: 1000,  // Delay between reconnection attempts in ms
    transports: ["websocket"],
    withCredentials: true,
 });
  

 
  

socket.on("connect", () => {
  console.log("Connected to backend");
});

socket.on("prediction", (data) => {
  console.log("Received prediction:", data);
});

export default socket;
