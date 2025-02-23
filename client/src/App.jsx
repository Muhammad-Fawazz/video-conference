import React, { useState, useEffect } from "react";
import CallContainer from "./components/CallContainer.jsx";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
      <CallContainer />
    </>
  );
}

export default App;
