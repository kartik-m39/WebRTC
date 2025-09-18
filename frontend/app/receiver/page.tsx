"use client";

import useSocket from "@/hooks/useSocket";
import { useEffect, useRef } from "react";

export default function Receiver(){

    const socket = useSocket();
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        if(!socket) return;

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "receiver"}))
        }

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

        // Add connection state debugging
        pc.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', pc.iceConnectionState);
        };
        
        pc.onconnectionstatechange = () => {
            console.log('Connection State:', pc.connectionState);
        };
        
        pc.onicegatheringstatechange = () => {
            console.log('ICE Gathering State:', pc.iceGatheringState);
        };
        
        // Set up ontrack BEFORE setting remote description
        // Here we get the tracks automatically, whenever they add track to their pc object
        pc.ontrack = ({ streams: [stream] }) => {         // check out the MDN docs for this
            if(videoRef.current){
                videoRef.current.srcObject = stream
                videoRef.current?.play();
            }
        };

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            // console.log(message);

            if(message.type === "offer"){
                // setting the remote description to offer
                await pc.setRemoteDescription(message.sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.send(JSON.stringify({ type: "answer", sdp: answer }));

            } else if(message.type === "iceCandidates"){
                await pc.addIceCandidate(message.candidates)      // Whenever you get other party's iceCandidates, add them to your pc object
            }
        } 

        // Initially we do not get all the ice candidates, so whenever we get one from a stun server, inform the other party as well
        pc.onicecandidate = (event) => {
            socket.send(JSON.stringify({type: "iceCandidates", candidates: event.candidate}))
        }

    }, [socket]);

    return (
        <div className="flex items-center justify-center flex-col gap-4 min-h-screen">
            <h1 className="text-3xl">
                Receiver
            </h1>
            <video 
                ref={videoRef} 
                muted 
                autoPlay 
                playsInline 
                style={{ 
                    // border: '1px solid red', 
                    // backgroundColor: 'black',
                    display: 'block'
                }}
            />
        </div>
    )
}