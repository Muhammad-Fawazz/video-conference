// src/components/CallContainer.jsx
import React from "react";
import VideoChat from "./VideoChat";
import { useParams, useLocation } from "react-router-dom";

export default function CallContainer() {
  // Fetch slug from route parameters
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name || "Anonymous";

  return (
    <>
      <h1>Room: {roomId}</h1>
      <h2>Welcome, {name}!</h2>
      <VideoChat name={name} roomId={roomId} />
    </>
  );
}
