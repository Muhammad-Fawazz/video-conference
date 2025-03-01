import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a unique room ID
    const roomId = uuidv4();
    // save the name with the room details(if needed)
    // Navigate to the room route
    navigate(`/room/${roomId}`);
  };
  return (
    <>
      <h1>Create a Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter your name"
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
}
