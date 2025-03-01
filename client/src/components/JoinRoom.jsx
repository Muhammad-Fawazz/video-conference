import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CallContainer from "./CallContainer";

export default function JoinRoom() {
  const navigate = useNavigate();

  // Fetch slug from route parameters
  const { roomId } = useParams();
  console.log("Room details", roomDetails);
  return (
    <>
      <CallContainer />
    </>
  );
}
