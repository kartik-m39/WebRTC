import { useEffect, useState } from "react";

export default function useSocket() {
    const [socket, setsocket] = useState<WebSocket | null>(null);
    
        useEffect(() => {
            const ws = new WebSocket("https://webrtc-1-0dm6.onrender.com/");
            setsocket(ws);
        }, []);

    return socket

}