import React, { useState } from "react";
import "./LoginPage.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage({ setIsLoggedIn, setUsername2 }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:8081/login", { username, password })
      .then((res) => {
        if (res.data.Status === "Success") {
          setIsLoggedIn(true);
          setUsername2(username);
          navigate("/home");
        } else {
          setIsLoggedIn(false);
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <h1 className="title">My Website</h1>
      <div className="logbox">
        <div className="firstRow">
          <h1>Log in</h1>
          <p>
            If you don't have an account click <Link to="/signUp">here!</Link>
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
        <button onClick={handleSubmit}>Log in</button>
        <p className="error-message"></p>

        <br />
        <Link className="change" to="/changepass">
          Change Password
        </Link>
      </div>
    </>
  );
}

export default LoginPage;
