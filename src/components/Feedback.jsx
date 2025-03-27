import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feedback.css";
import LogoutButton from "./Logout";

function Feedback({ setIsLoggedIn, username }) {
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/getFeedback").then((res) => {
      setFeedbackList(res.data);
    });
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/submitFeedback", { username, feedback })
      .then(() => {
        setFeedback("");
        axios.get("http://localhost:8081/getFeedback").then((res) => {
          setFeedbackList(res.data);
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="feedback-page">
        <div className="feedback-container">
          <h2>Submit Feedback</h2>
          <p>
            Logged in as: <strong>{username}</strong>
          </p>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback..."
              required
            />
            <button type="submit">Submit</button>
          </form>

          <h2>Feedback List</h2>
          <div className="feedback-messages">
            {feedbackList.map((item, index) => (
              <div className="message" key={index}>
                <strong>{item.username}</strong>: {item.feedback}
                <em>({item.submitted_at})</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Feedback;
