import React, { useEffect, useRef, useState } from "react";
import { makeCall, setupPeerConnection, socket } from "../services/callService";

export default function VideoChat(name, roomId) {
  const [pc, setPc] = useState();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(new MediaStream());
  useEffect(() => {
    const peerConn = setupPeerConnection(name, roomId);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => peerConn.addTrack(track, stream));
      })
      .catch((err) => console.error("getUserMedia error:", err));

    peerConn.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      peerConn.close();
      socket.off("connect");
    };
  }, []);

  const handleCall = async () => {
    try {
      await makeCall(name, roomId);
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  };

  return (
    <>
      <h2>Start your webcam</h2>
      {/* <button onClick={startWebcam}>Start webcam</button> */}
      <div className="videos">
        <span>
          <h3>Local</h3>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "300px" }}
          />
        </span>
        <span>
          <h3>Remote</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px" }}
          />
        </span>
      </div>
      <button onClick={handleCall}>Call everyone in the room</button>
    </>
  );
}
