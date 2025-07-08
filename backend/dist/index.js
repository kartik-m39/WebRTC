"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", (socket) => {
    socket.on("message", (event) => {
        const parsedData = JSON.parse(event);
        if (parsedData.type === "sender") {
            console.log("sender connected");
            senderSocket = socket;
        }
        if (parsedData.type === "receiver") {
            console.log("receiver connected");
            receiverSocket = socket;
        }
        if (parsedData.type === "createOffer") {
            console.log("offer received");
            const payload = {
                type: "offer",
                sdp: parsedData.sdp
            };
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify(payload));
        }
        if (parsedData.type === "answer") {
            console.log("answer sent");
            const payload = {
                type: "answer",
                sdp: parsedData.sdp
            };
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify(payload));
        }
        if (parsedData.type === "iceCandidates") {
            const payload = {
                type: "iceCandidates",
                candidates: parsedData.candidates
            };
            if (socket === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify(payload));
            }
            if (socket === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify(payload));
            }
        }
    });
});
// createOffer
// answer
// iceCandidates
// type: icecandidates, candidate: sdp.iceCandidate
