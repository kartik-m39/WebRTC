import { useEffect, useState } from "react";

export default function useSocket() {
    const [socket, setsocket] = useState<WebSocket | null>(null);
    
        useEffect(() => {
            const ws = new WebSocket("ws://localhost:8080");
            setsocket(ws);
        }, []);

    return socket

}