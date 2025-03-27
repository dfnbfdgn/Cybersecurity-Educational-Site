import React, { useState } from "react";
import "./signUp.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function handleRegister(event) {
    event.preventDefault();
    axios
      .post("http://localhost:8081/signUp", { username, password })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <h1 className="title2">Create an Account!</h1>
      <div className="logbox">
        <div className="firstRow">
          <h1 className="signup-sub">Sign Up</h1>
          <p>
            Already have an account? Click <Link to="/">here!</Link>
          </p>
        </div>
        <div className="inputboxes">
          <div className="inputboxes-username">
            <p>Username</p>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputboxes-password">
            <p>Password</p>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button onClick={handleRegister}>Register</button>
        <p className="error-message"></p>
        <div className="instructions">
          <b>
            Password MUST contain
            <br />- Between 10 - 24 characters
            <br />
            - At least 1 number
            <br /> - 1 Capital letter
            <br /> - 1 Special character
          </b>
        </div>
        <br />
      </div>
    </>
  );
}

export default SignUp;
