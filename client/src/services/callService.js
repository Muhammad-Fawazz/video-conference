import { io } from "socket.io-client";

// Initialize the Socket.IO client (adjust the URL as needed)
export const socket = io("http://localhost:3000");

// Configuration for the RTCPeerConnection (using a public STUN server)
const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

let peerConnection;

// This function sets up the RTCPeerConnection and the Socket.IO listeners
const data = {};
export function setupPeerConnection(name, roomId) {
    peerConnection = new RTCPeerConnection(configuration);
    // Take data taken by form and emit give it to the server
    data.name = name;
    data.id = roomId;
    socket.emit("join", { data });

    // Console a list of joined users in the room
    socket.on("joined_users", (users) => {
        console.log("[joined] room:" + users.id + " name: " + users.name);
    });

    // Listen for an offer from a remote peer
    socket.on("getOffer", async (message) => {
        if (message.offer) {
            console.log("Received offer:", message.offer);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            // Create an answer and send it back
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("answer", { answer });
            console.log("Sent answer:", answer);
        }
    });

    socket.on("getAnswer", async (message) => {
        if (message.answer) {
            console.log(message.answer);
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        }
    });

    // Listen for ICE candidates from remote peers
    socket.on("getCandidate", async (message) => {
        if (message.candidate) {
            try {
                await peerConnection.addIceCandidate(message.candidate);
                console.log("Added remote ICE candidate:", message.candidate);
            } catch (e) {
                console.error("Error adding remote ICE candidate:", e);
            }
        }
    });

    // When a local ICE candidate is generated, send it via Socket.IO
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("candidate", { candidate: event.candidate });
            console.log("Sent local ICE candidate:", event.candidate);
        }
    };


    return peerConnection;
}

// This function initiates the call by creating an offer
export async function makeCall(name, roomId) {
    if (!peerConnection) {
        setupPeerConnection(name, roomId);
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", { offer });
    console.log("Offer sent:", offer);
    return peerConnection;
}
