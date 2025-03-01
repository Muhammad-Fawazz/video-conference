import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CallContainer from "./components/CallContainer.jsx";
import JoinRoom from "./components/JoinRoom.jsx";
import CreateRoom from "./components/CreateRoom.jsx";
import NavBar from "./components/NavBar.jsx";
import NoMatch from "./Components/NoMatch";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:3000/room/create")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data));
  // }, []);

  return (
    <>
      {/* <p>{message}</p> */}

      <NavBar />
      <Routes>
        <Route path="/" />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<JoinRoom />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
