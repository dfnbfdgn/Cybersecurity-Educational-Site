import React from "react";
import "./FirstPage.css";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";

function FirstPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/feedback");
  };

  return (
    <div className="page-container">
      <LogoutButton setIsLoggedIn={setIsLoggedIn} />
      <video src="/videos/background-video.mp4" autoPlay loop muted />
      <p className="page1-text">Cybersecurity Website</p>
      <button className="page1-button" onClick={handleClick}>
        FEEDBACK
      </button>
    </div>
  );
}

export default FirstPage;
