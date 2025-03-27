import React, { useState } from "react";
import "./ChangePass.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePass() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newPass, setNewPass] = useState("");

  function handlePass(event) {
    event.preventDefault();
    axios
      .post("http://localhost:8081/login", { username, password })
      .then((res) => {
        if (res.data.Status === "Success") {
          axios
            .post("http://localhost:8081/changePass", {
              password,
              newPass,
              username,
            })
            .then((res) => {
              if (res.data.Status === "Password updated successfully")
                navigate("/");
              else alert(res.data.Error);
            })
            .catch((err) => console.log(err));
        } else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="logbox-changepass">
        <div className="firstRow">
          <h1>Change Password</h1>
          <p>
            <Link to="/">Return to Login</Link>
          </p>
        </div>
        <div className="inputboxes">
          <div className="inputboxes-username">
            <p>Current Username</p>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputboxes-password">
            <p>Current Password</p>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <p>New Password</p>
            <input
              type="password"
              placeholder="New Password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
        </div>
        <button onClick={handlePass}>Submit</button>
        <div className="instructions-changepass">
          <b>
            Password MUST contain
            <br />- Between 10 - 24 characters
            <br />
            - At least 1 number
            <br /> - 1 Capital letter
            <br /> - 1 Special character
          </b>
        </div>
        <p className="error-message"></p>

        <br />
      </div>
    </>
  );
}

export default ChangePass;
