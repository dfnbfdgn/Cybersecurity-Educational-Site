import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/signUp";
import ChangePass from "./components/ChangePass";
import FirstPage from "./components/FirstPage";
import Feedback from "./components/Feedback";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername2] = useState("");
 
  return (
    <Router>
      <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setUsername2={setUsername2} />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/changePass" element={<ChangePass />} />
        <Route
          path="/home"
          element={isLoggedIn ? <FirstPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
         <Route
          path="/feedback"
          element={
            isLoggedIn ? <Feedback username={username} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;