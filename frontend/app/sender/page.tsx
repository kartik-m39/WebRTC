"use client";

import useSocket from "@/hooks/useSocket";
import { useEffect, useRef } from "react"

export default function Sender(){
    const socket = useSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(!socket) return

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "sender"}))
        }

    }, [socket]);

    async function handleConnection(){
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: "stun:stun3.l.google.com:3478" },
                { urls: "stun:stun3.l.google.com:5349" },
                { urls: "stun:stun4.l.google.com:19302" },
                { urls: "stun:stun4.l.google.com:5349" }
            ]
        });
        if(!socket) return;

        // Whenever both the parties need to re-exchange their offers and answers, onnegotiationneeded helps here, it recreates the offer and send it 
        pc.onnegotiationneeded = async() => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.send(JSON.stringify({ type: "createOffer", sdp: offer}));
        }

        // Initially we do not get all the ice candidates, so whenever we get one from a stun server, inform the other party as well
        pc.onicecandidate = (event) => {
            if(event.candidate){
                socket.send(JSON.stringify({type: "iceCandidates", candidates: event.candidate}))
            }
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if(message.type === "answer"){
                await pc.setRemoteDescription(message.sdp);
            } else if(message.type === "iceCandidates"){
                await pc.addIceCandidate(message.candidates)      // Whenever you get other party's iceCandidates, add them to your pc object
            }
        }

        // Accessing the user's audio and video
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });

        // console.log("stream:  " + stream);

        // pc.addTrack(stream.getVideoTracks()[0]) => Not Working ******

        // From MDN docs
        // Whenever something is added to track, it will re-trigger onnegotionneeded handler and add the audio and video tracks to the pc connection object
        for (const track of stream.getTracks()) {
            pc.addTrack(track, stream);
        }

        if(videoRef.current){
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }
    }

    return (
        <div className="flex justify-center items-center flex-col gap-4 min-h-screen">
            <h1 className="text-3xl">Sender</h1>
            <button onClick={handleConnection} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-500">Send</button>
            <video ref={videoRef} ></video>
        </div>
    )
}