import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080});

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null;

wss.on("connection" , (socket: WebSocket) => {
    socket.on("message", (event: string) => {
        const parsedData = JSON.parse(event);

        if(parsedData.type === "sender"){
            console.log("sender connected");
            senderSocket = socket
        }

        if(parsedData.type === "receiver"){
            console.log("receiver connected");
            receiverSocket = socket
        }

        if(parsedData.type === "createOffer"){
            console.log("offer received");
            const payload = {
                type: "offer",
                sdp: parsedData.sdp
            }

            receiverSocket?.send(JSON.stringify(payload))
        }

        if(parsedData.type === "answer"){
            console.log("answer sent")
            const payload = {
                type: "answer",
                sdp: parsedData.sdp
            }

            senderSocket?.send(JSON.stringify(payload));
        }
        
        if(parsedData.type === "iceCandidates"){
            const payload = {
                type: "iceCandidates",
                candidates: parsedData.candidates
            }
            if(socket === senderSocket){
                receiverSocket?.send(JSON.stringify(payload))
            }
            if(socket === receiverSocket){
                senderSocket?.send(JSON.stringify(payload));
            }
        }
    })
})



// createOffer
// answer
// iceCandidates

// type: icecandidates, candidate: sdp.iceCandidate