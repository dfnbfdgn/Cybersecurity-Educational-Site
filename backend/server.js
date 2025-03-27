const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const he = require("he");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const failedLogins = {};

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
});

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{10,24}$/;

app.post("/signUp", async (req, res) => {
  const username = he.escape(req.body.username);
  const password = req.body.password;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be between 10-24 characters, contain a capital letter, and a special character.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO accounts (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err, data) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Error inserting data into database" });
      }
      return res.json({ message: "User signed up successfully!" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Error hashing password" });
  }
});

app.post("/login", (req, res) => {
  const username = he.escape(req.body.username);
  const password = req.body.password;

  if (failedLogins[username] && failedLogins[username].lockout > Date.now()) {
    return res
      .status(403)
      .json({ Error: "Too many failed attempts. Try again later." });
  }

  const sql = "SELECT * FROM accounts WHERE username = ?";
  db.query(sql, [username], async (err, data) => {
    if (err) return res.json({ Error: "Database Error" });

    if (data.length > 0) {
      const match = await bcrypt.compare(password, data[0].password);

      if (match) {
        delete failedLogins[username];
        return res.json({ Status: "Success" });
      }
    }

    if (!failedLogins[username]) {
      failedLogins[username] = { attempts: 1, lockout: 0 };
    } else {
      failedLogins[username].attempts += 1;
    }

    if (failedLogins[username].attempts >= 5) {
      failedLogins[username].lockout = Date.now() + 60 * 1000;
      return res
        .status(403)
        .json({ Error: "Too many failed attempts. Try again later." });
    }

    return res.json({ Error: "Login Failed" });
  });
});

app.post("/submitFeedback", (req, res) => {
  const username = he.escape(req.body.username);
  const feedback = he.escape(req.body.feedback);

  const sql = "INSERT INTO feedback (username, feedback) VALUES (?, ?)";
  db.query(sql, [username, feedback], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error submitting feedback" });
    }
    return res.json({ message: "Feedback submitted successfully!" });
  });
});

app.get("/getFeedback", (req, res) => {
  const sql =
    "SELECT username, feedback, submitted_at FROM feedback ORDER BY submitted_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error retrieving feedback" });
    }
    results.forEach((feedback) => {
      feedback.feedback = he.escape(feedback.feedback);
    });
    return res.json(results);
  });
});

app.post("/changePass", (req, res) => {
  const username = he.escape(req.body.username);
  const password = req.body.password;
  const newPass = req.body.newPass;

  if (!passwordRegex.test(newPass)) {
    return res.status(400).json({
      error:
        "Password must be between 10-24 characters, contain a capital letter, and a special character.",
    });
  }

  const sql = "SELECT * FROM accounts WHERE username = ?";
  db.query(sql, [username], async (err, data) => {
    if (err) return res.json({ Error: "Database Error" });

    if (data.length > 0) {
      const match = await bcrypt.compare(password, data[0].password);

      if (match) {
        const hashedNewPass = await bcrypt.hash(newPass, 10);
        const updateSql = "UPDATE accounts SET password = ? WHERE username = ?";
        db.query(updateSql, [hashedNewPass, username], (err, data) => {
          if (err) return res.json({ Error: "Failed to update password" });
          return res.json({ Status: "Password updated successfully" });
        });
      } else {
        return res.json({ Error: "Incorrect current password" });
      }
    } else {
      return res.json({ Error: "User not found" });
    }
  });
});

app.listen(8081, () => {
  console.log("Listening...");
});
